'use strict';

module.exports = function (grunt) {

    grunt.config.init({
        eslint: {
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

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-bump');

    // default task
    grunt.registerTask('default', ['eslint:all']);
};
