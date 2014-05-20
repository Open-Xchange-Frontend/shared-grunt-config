'use strict';
module.exports = function (grunt) {
    grunt.config.extend('copy', {
        source: {
            files: [{
                src: [
                    'apps/**/*',
                    'lib/**/*',
                    'config/**/*',
                    'grunt/tasks/*',
                    'Gruntfile.js',
                    '.jshintrc',
//TODO: removed bower.json from source package, since grunt dist:build fails with 'git not installed' error, even if bower_components/ is complete
//                     'bower.json',
                    'package.json'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
            }]
        },
        dependencies: {
            files: [{
                src: [
                    'node_modules/**/*',
                    'bower_components/**/*'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
            }]
        }
    });

    grunt.config.extend('clean', {
        dist_source: ['dist/<%= pkg.name %>-<%= pkg.version %>/']
    });

    grunt.registerTask('dist:source', 'create a source tarball of the module', function () {
        grunt.task.run('clean:dist_source');
        grunt.util.runPrefixedSubtasksFor('copy', 'source')();
        if (grunt.option('include-dependencies')) {
            grunt.task.run(['checkDependencies:build', 'bower:install']);
            grunt.util.runPrefixedSubtasksFor('copy', 'dependencies')();
        }
        if (grunt.isPeerDependencyInstalled('grunt-contrib-compress') && !grunt.option('no-compress')) {
            grunt.task.run('compress:source');
        } else if (grunt.option('compress') === undefined) {
            grunt.log.warn('grunt-contrib-compress module not installed, will not compress sources');
        } else if (grunt.option('compress') === true) {
            grunt.fail.fatal('grunt-contrib-compress module not installed');
        }
    });

    grunt.registerTask('dist:dependencies', 'create a source tarball of the dependencies of the module', function () {
        grunt.task.run(['clean:dist_source', 'checkDependencies:build', 'bower:install']);
        grunt.util.runPrefixedSubtasksFor('copy', 'dependencies')();
        if (grunt.isPeerDependencyInstalled('grunt-contrib-compress') && !grunt.option('no-compress')) {
            grunt.util.runPrefixedSubtasksFor('compress', 'dependencies')();
        } else if (grunt.option('compress') === undefined) {
            grunt.log.warn('grunt-contrib-compress module not installed, will not compress dependencies');
        } else if (grunt.option('compress') === true) {
            grunt.fail.fatal('grunt-contrib-compress module not installed');
        }
    });
};
