'use strict';
module.exports = function (grunt) {
    grunt.config.merge({
        copy: {
            source: {
                files: [{
                    expand: true,
                    src: [
                        'apps/**/*',
                        'lib/**/*',
                        'conf/**/*',
                        'grunt/tasks/*',
                        'i18n/**/*',
                        'lib/**/*',
                        'Gruntfile.js',
                        '.jshintrc',
                        'bower.json',
                        'package.json'
                    ],
                    dot: true,
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
                }]
            },
            dependencies: {
                files: [{
                    expand: true,
                    src: [
                        'node_modules/**/*',
                        'bower_components/**/*'
                    ],
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
                }]
            },
            packaging_rpm: {
                files: [{
                    expand: true,
                    src: ['<%= pkg.name %>.spec'],
                    dest: 'dist/'
                }]
            },
            packaging_deb: {
                files: [{
                    expand: true,
                    src: ['debian/**/*'],
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
                }]
            }
        }
    });

    grunt.config.merge({
        clean: {
            dist_source: ['dist/<%= pkg.name %>-<%= pkg.version %>/']
        }
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

    grunt.config.merge({
        exec: {
            dpkg_source: {
                cmd: 'dpkg-source -Zgzip -b <%= pkg.name %>-<%= pkg.version %>/',
                cwd: 'dist/'
            }
        }
    });

    grunt.registerTask('dist:dpkg-source', 'run dpkg-source to create debian specific packaging information', function () {
        grunt.task.run(['copy:packaging_deb', 'exec:dpkg_source']);
    });

    grunt.registerTask('dist:rpm', 'put everything to build an rpm into dist directory', function () {
        grunt.task.run('copy:packaging_rpm');
    });

    grunt.util.registerDummyTask('exec', 'grunt-exec');
    if (grunt.isPeerDependencyInstalled('grunt-exec')) {
        grunt.loadNpmTasks('grunt-exec');
    }
};
