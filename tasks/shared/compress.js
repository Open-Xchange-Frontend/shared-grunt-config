'use strict';

module.exports = function (grunt) {

    if (!grunt.isPeerDependencyInstalled('grunt-contrib-compress')) {
        grunt.verbose.warn('Skipping optional compress tasks');
        return;
    }

    grunt.config.extend('compress', {
        dependencies: {
            options: {
                archive: 'dist/dependencies.tar.gz'
            },
            files: [{
                src: ['bower_components/**/*', 'node_modules/**/*']
            }]
        },
        source: {
            options: {
                archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.orig.tar.gz'
            },
            files: [{
                expand: true,
                src: ['<%= pkg.name %>-<%= pkg.version %>/**/*', '<%= pkg.name %>-<%= pkg.version %>/**/.*'],
                cwd: 'dist/source/'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
};
