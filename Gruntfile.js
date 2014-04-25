'use strict';

module.exports = function (grunt) {

    grunt.config.init({
        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: ['Gruntfile.js', 'tasks/**/*.js']
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                createTag: false,
                push: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump');

    // default task
    grunt.registerTask('default', ['jshint:all']);
};
