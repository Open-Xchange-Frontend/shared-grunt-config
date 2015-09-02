module.exports = function (grunt) {
    'use strict';

    var net = require('net');
    var url = require('url');

    var proxy = grunt.config('local.proxy') === true ? 8080 : grunt.config('local.proxy');

    if (proxy && grunt.config('local.appserver.livereload')) {
        grunt.fail.warn('Proxy will not work with livereload enabled. Set appserver.livereload to false in grunt/local.conf.json');
    } else if (!proxy) {
        //no proxy configured
        return;
    }

    var appserverUrl;
    grunt.event.once('connect.server.listening', function (host, port) {
        appserverUrl = {};
        appserverUrl.port = port;
        appserverUrl.hostname = host;
    });

    grunt.config.merge({ connect: {
        proxy: {
            options: {
                port: proxy,
                onCreateServer: [function (server) {
                    server.on('connect', function (req, cltSocket, head) {
                        // connect to an origin server
                        var srvUrl;
                        var conf = grunt.config('local.appserver');
                        if (appserverUrl && conf && (conf.server || '').indexOf(req.headers.host) >= 0) {
                            //intended appserver connection
                            srvUrl = appserverUrl;
                        } else {
                            srvUrl = url.parse('https://' + req.url);
                        }
                        var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function () {
                            cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                            'Proxy-agent: Node-Proxy\r\n' +
                            '\r\n');
                            srvSocket.write(head);
                            srvSocket.pipe(cltSocket);
                            cltSocket.pipe(srvSocket);
                        });
                        //add timeout, because we do not want to wait very long
                        //timeout will trigger when no traffic is done at all for 5s
                        srvSocket.setTimeout(10000);
                        srvSocket.on('timeout', function () {
                            srvSocket.end();
                            cltSocket.end();
                        });
                    });
                    server.on('clientError', function (err) {
                        console.log('got HTTP client error', err);
                    });
                }],
                middleware: [
                    //need to handle requests, that are not CONNECT
                    //like GET, which are send when HTTP (no HTTPS) is proxied
                    function (request, response, next) {
                        var opt = require('url').parse(request.url);
                        opt.headers = request.headers;
                        opt.method = request.method;

                        var proxyRequest = require('http').request(opt, function (res) {
                            response.writeHead(res.statusCode, res.headers);
                            res.on('data', function (chunk) {
                                response.write(chunk, 'binary');
                            });
                            res.on('end', function (chunk) {
                                response.end(chunk, 'binary');
                            });
                        });
                        proxyRequest.setTimeout(10000, function () {
                            proxyRequest.end();
                            next();
                        });
                        request.pipe(proxyRequest);
                    }
                ]
            }
        }
    }});
};
