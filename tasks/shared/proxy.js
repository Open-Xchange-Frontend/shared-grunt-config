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

    var agent, protocol, protocolImpl;
    var proxyURL = grunt.config('local.appserver.upstream_proxy') || process.env.http_proxy;
    if (proxyURL) {
        agent = new (require('proxy-agent'))(proxyURL);
        protocol = url.parse(proxyURL).protocol === 'https:' ? 'https' : 'http';
        protocolImpl = require(protocol);
        protocol += ':';
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
                        var host = req.headers.host.split(':')[0];
                        var reqPort = req.headers.host.split(':')[1] || '443';
                        var conf = grunt.config('local.appserver');
                        var server = conf.server || '';
                        //default to 443, that's what browsers do
                        var serverPort = (server.match(/:([0-9]+)\//) || [])[1] || '443';
                        if (appserverUrl && conf && server.indexOf(host) >= 0) {
                            //intended appserver connection
                            srvUrl = {};
                            srvUrl.hostname = appserverUrl.hostname;
                            if (reqPort !== serverPort) {
                                //do not change the port if not meant for appserver
                                //this should allow livereload
                                srvUrl.port = reqPort;
                            } else {
                                srvUrl.port = appserverUrl.port;
                            }
                        } else {
                            srvUrl = url.parse('https://' + req.url);
                            if (agent) {
                                var opt = url.parse(proxyURL);
                                opt.method = req.method;
                                opt.headers = req.headers;
                                opt.headers.host = opt.host;
                                opt.path = req.url;
                                opt.protocol = protocol;
                                opt.rejectUnauthorized = conf.rejectUnauthorized;
                                //opt.agent = agent;
                                var proxyRequest = protocolImpl.request(opt);
                                proxyRequest.end();
                                proxyRequest.on('connect', function (res, srvSocket) {
                                    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                                        'Proxy-agent: Node-Proxy\r\n' +
                                        '\r\n');
                                    srvSocket.write(head);
                                    srvSocket.setTimeout(120000);
                                    srvSocket.pipe(cltSocket);
                                    cltSocket.pipe(srvSocket);
                                });
                                proxyRequest.on('socket', function (srvSocket) {
                                    //add a quite low timeout value, because the proxy will always be reachable, but the remote might not
                                    srvSocket.setTimeout(10000);
                                    srvSocket.on('timeout', function () {
                                        srvSocket.end();
                                        cltSocket.end();
                                    });
                                });
                                return;
                            }
                        }
                        var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function () {
                            cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                                'Proxy-agent: Node-Proxy\r\n' +
                                '\r\n');
                            srvSocket.write(head);
                            //reset timeout to default, because we the connection now most likely works
                            srvSocket.setTimeout(120000);
                            srvSocket.pipe(cltSocket);
                            cltSocket.pipe(srvSocket);
                        });
                        //add a quite low timeout value, because the proxy will always be reachable, but the remote might not
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
                        if (agent) opt.agent = agent;

                        var proxyRequest = protocolImpl.request(opt, function (res) {
                            response.writeHead(res.statusCode, res.headers);
                            res.on('data', function (chunk) {
                                response.write(chunk, 'binary');
                            });
                            res.on('end', function (chunk) {
                                response.end(chunk, 'binary');
                            });
                        });
                        //TODO: 10s might be a little low, there might be requests that take longer
                        //find a similar solution to the one above (only set low timeout until remote has answered once)
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
