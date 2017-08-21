/* This file has been generated by ox-ui-module generator.
 * Please only apply minor changes (better no changes at all) to this file
 * if you want to be able to run the generator again without much trouble.
 *
 * If you really have to change this file for whatever reason, try to contact
 * the core team and describe your use-case. May be, your changes can be
 * integrated into the templates to be of use for everybody.
 */
'use strict';

module.exports = function (grunt) {
    function tryRead(file) {
        try {
            //file found, return it
            return grunt.file.read(file);
        } catch (e) {
            //PEM data injected directly, return it
            if (/^---/.test(file)) return file;
        }
        //no data found
        return null;
    }

    grunt.registerTask('serve', ['connect:server:keepalive']);

    if (grunt.isPeerDependencyInstalled('appserver')) {
        var appserver = require('appserver');
        var _ = require('underscore');

        grunt.config.merge({
            connect: {
                server: {
                    options: {
                        port: grunt.config('local.appserver.port') || 8337,
                        protocol: grunt.config('local.appserver.protocol') || 'http',
                        hostname: '*',
                        base: ['build/'],
                        livereload: grunt.config('local.appserver.livereload') === undefined || grunt.config('local.appserver.livereload'),//default to true
                        onCreateServer: function (server) {
                            var config = appserver.tools.unifyOptions(grunt.config('local.appserver'));

                            server.on('upgrade', appserver.middleware.wsProxy(config));
                        },
                        middleware: function (connect, options, middlewares) {
                            var config = grunt.config().local.appserver;
                            if (config.server === '') {
                                grunt.log.error('Server not specified in grunt/local.conf.json');
                                grunt.log.writeln('Hint: If this is a new setup you may want to run `grunt show-config:local --output grunt/local.conf.json` and change its values according to your setup.');
                                grunt.fail.fatal('Please adjust your local.conf.json');
                            }

                            config.prefixes = (config.prefixes || []).concat(options.base);
                            config.manifests = (config.manifests || []).concat(options.base + '/manifests/');

                            config.prefixes = _.uniq(config.prefixes);
                            config.manifests = [].concat.apply(config.manifests, config.prefixes.map(function (prefix) {
                                return prefix + '/manifests/';
                            }));
                            config.manifests = _.uniq(config.manifests);

                            config = appserver.tools.unifyOptions(config);

                            // Todo: Take care of middlewares by connect
                            middlewares = [];

                            if (this.flags.mock === true) {
                                middlewares.push(appserver.middleware.mockData(config));
                            }
                            middlewares.push(appserver.middleware.preFetch(config));
                            middlewares.push(appserver.middleware.ui(config));
                            middlewares.push(appserver.middleware.login(config));
                            middlewares.push(appserver.middleware.proxy(config));
                            return middlewares;
                        }
                    }
                }
            }
        });

        var key = tryRead(grunt.config('local.appserver.key') || 'ssl/host.key');
        var cert = tryRead(grunt.config('local.appserver.cert') || 'ssl/host.crt');
        var ca = tryRead(grunt.config('local.appserver.ca') || 'ssl/rootCA.crt');

        if (key && cert && ca) {
            grunt.config.set('connect.server.options.key', key);
            grunt.config.set('connect.server.options.cert', cert);
            grunt.config.set('connect.server.options.ca', ca);
        }

    }

    grunt.util.registerDummyTask('connect', ['grunt-contrib-connect', 'appserver']);
    if (grunt.isPeerDependencyInstalled('grunt-contrib-connect')) {
        grunt.loadNpmTasks('grunt-contrib-connect');
    }
};
