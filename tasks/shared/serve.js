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
    if (!grunt.isPeerDependencyInstalled('grunt-contrib-connect')) {
        grunt.verbose.warn('Skipping optional serve/connect tasks');
        return;
    }

    var appserver = require('appserver');
    var _ = require('underscore');

    grunt.config.merge({
        connect: {
            server: {
                options: {
                    port: 8337,
                    protocol: grunt.config('local.appserver.protocol') || 'http',
                    base: ['build/'],
                    livereload: grunt.config('local.appserver.livereload') || true,
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

                        middlewares.push(appserver.middleware.appsload(config));
                        middlewares.push(appserver.middleware.manifests(config));
                        middlewares.push(appserver.middleware.login(config));
                        middlewares.push(appserver.middleware.localfiles(config));
                        middlewares.push(appserver.middleware.proxy(config));
                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.registerTask('serve', ['connect:server:keepalive']);

    grunt.loadNpmTasks('grunt-contrib-connect');
};
