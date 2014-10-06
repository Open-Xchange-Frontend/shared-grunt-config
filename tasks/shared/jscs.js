'use strict';

module.exports = function (grunt) {

    if (!grunt.file.exists('.jscs.json')) {
        grunt.verbose.warn('No .jscs.json found, skipping jscs tests.');
        return;
    }

    grunt.config.merge({
        jscs: {
            options: {
                config: '.jscs.json'
            },
            specs: {
                src: ['spec/**/*_spec.js']
            },
            all: {
                src: ['Gruntfile.js', 'grunt/tasks/*.js', 'apps/**/*.js', 'src/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-jscs');
};
