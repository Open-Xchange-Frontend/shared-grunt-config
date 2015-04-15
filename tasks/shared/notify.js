'use strict';

module.exports = function (grunt) {

    if (!grunt.isPeerDependencyInstalled('grunt-notify')) {
        grunt.verbose.warn('Skipping optional notify tasks');
        return;
    }

    grunt.loadNpmTasks('grunt-notify');
};
