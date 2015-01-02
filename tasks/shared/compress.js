'use strict';

module.exports = function (grunt) {

    if (!grunt.isPeerDependencyInstalled('grunt-contrib-compress')) {
        grunt.verbose.warn('Skipping optional compress tasks');
        return;
    }

    grunt.config.merge({
        compress: {
            dependencies_bower: {
                options: {
                    archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.orig-bower_components.tar.gz'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/<%= pkg.name %>-<%= pkg.version %>/',
                    src: ['bower_components/**/*']
                }]
            },
            dependencies_node: {
                options: {
                    archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.orig-node_modules.tar.gz'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/<%= pkg.name %>-<%= pkg.version %>/',
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
                    cwd: 'dist/'
                }]
            },
            dist: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>.tar.gz'
                },
                files: [{
                    expand: true,
                    src: ['**/*'],
                    dot: true,
                    filter: 'isFile',
                    cwd: 'dist/'
                }]
            }
        }
    });

    grunt.registerTask('dist:tgz', 'create a tar.gz file of the dist/ directory', ['compress:dist']);

    grunt.loadNpmTasks('grunt-contrib-compress');
};
