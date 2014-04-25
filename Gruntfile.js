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
                createTag: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    // default task
    grunt.registerTask('default', ['jshint:all']);
};
