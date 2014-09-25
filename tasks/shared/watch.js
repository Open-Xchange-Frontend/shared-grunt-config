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

    if (!grunt.isPeerDependencyInstalled('grunt-contrib-watch')) {
        grunt.verbose.warn('Skipping optional watch tasks');
        return;
    }

    var conf = grunt.config().local.appserver;
    var proto = (conf && conf.protocol === 'https') ? 'https' : 'http';

    var net = require('net');
    var server = net.createServer();
    server.on('error', function () {
        grunt.verbose.writeln('Livereload instance running, will enable send_livereload task.');
    });
    server.listen(35729, function () {
        var lrConf = true;
        grunt.verbose.writeln('No Livereload instance running, will configure watch to start one.');
        if (proto === 'https') {
            lrConf = {
                key: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key'),
                cert: grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt')
            };
        }
        grunt.config.set('watch.manifests.options.livereload', lrConf);
        grunt.config.set('watch.all.options.livereload', lrConf);
        if (grunt.task.current.name === 'watch') {
            grunt.task.run('watch');
        }
        server.close();
    });

    grunt.registerTask('send_livereload', function () {
        var done = this.async();
        if (!!grunt.config('watch.all.options.livereload')) {
            grunt.verbose.writeln('Using livereload from watch');
            done();
            return;
        }
        var http = require(proto);
        var req = http.request({
            hostname: 'localhost',
            port: 35729,
            path: '/changed',
            method: 'POST',
            rejectUnauthorized: false
        }, function () {
            grunt.verbose.writeln('Livereload request sent');
            done();
        });
        req.on('error', function (err) {
            grunt.log.warn('Could not send livereload:', err);
            done();
        });
        req.write(JSON.stringify({files: ['boot.js']}));
        req.end();
    });

    grunt.config.merge({
        watch: {
            options: {
                interval: 500,
                interrupt: true,
                debounceDelay: 500
            },
            manifests: {
                files: 'apps/**/manifest.json',
                tasks: ['manifests', 'force_update', 'send_livereload'],
                options: {}
            },
            karma: {
                files: ['spec/**/*.js'],
                tasks: ['lint:specs', 'testrun']
            },
            configs: {
                options: { reload: true },
                files: [
                    'Gruntfile.js',
                    'grunt/tasks/*.js',
                    'grunt/local.conf.json'
                ],
                tasks: ['default']
            },
            all: {
                files: [
                    'apps/**/*.{js,less}',
                    'src/*',
                    'lib/**/*.js',
                    'bower.json',
                    'package.json'
                ],
                tasks: ['default', 'force_update', 'send_livereload', 'testrun'],
                options: {}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};
