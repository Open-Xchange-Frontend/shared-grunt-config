'use strict';

module.exports = function (grunt) {

    if (!grunt.isPeerDependencyInstalled('grunt-contrib-compress')) {
        grunt.verbose.warn('Skipping optional compress tasks');
        return;
    }

    grunt.config.extend('compress', {
        dependencies_bower: {
            options: {
                archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.orig-bower_components.tar.gz'
            },
            files: [{
                expand: true,
                cwd: 'dist/source/dependencies/',
                src: ['bower_components/**/*']
            }]
        },
        dependencies_node: {
            options: {
                archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.orig-node_modules.tar.gz'
            },
            files: [{
                expand: true,
                cwd: 'dist/source/dependencies/',
                src: ['node_modules/**/*']
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
