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

    if (!grunt.isPeerDependencyInstalled('grunt-karma')) {
        grunt.verbose.warn('Skipping karma optional tasks');
        return;
    }

    grunt.config.extend('karma', {

        options: {
            configFile: 'karma.conf.js',
            builddir: 'build/'
        },
        unit: {
            background: true,
            autoWatch: false
        },
        serve: {
            backgrount: false,
            autoWatch: false
        },
        //continuous integration mode: run tests once in PhantomJS browser.
        continuous: {
            singleRun: true,
            browsers: ['PhantomJS'],
            reporters: ['junit']
        }

    });

    // testing stuff
    grunt.registerTask('test', ['karma:unit:start']);

    grunt.registerTask('testrun', 'Run the tests, if test server is running', function () {
        var done = this.async();

        var net = require('net');
        var server = net.createServer();
        server.on('error', function () {
            grunt.verbose.writeln('Karma server running, running specs');
            grunt.task.run('karma:unit:run');
            done();
        });
        server.listen(9876, function () {
            grunt.verbose.warn('No karma server running, skipping specs');
            server.close();
            done();
        });

    });

    grunt.loadNpmTasks('grunt-karma');
};
