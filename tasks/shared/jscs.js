'use strict';

module.exports = function (grunt) {

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

    grunt.util.registerDummyTask('jscs', 'grunt-jscs');
    if (grunt.isPeerDependencyInstalled('grunt-jscs'))
        grunt.loadNpmTasks('grunt-jscs');

    if (!grunt.file.exists('.jscs.json')) {
        grunt.registerTask('jscs', 'Dummy task (jscs config file missing)', function () {
            grunt.log.warn('`.jscs.json` missing in current working directory. Skipping optional jscs task.');
        });
    }
};
