/* This file has been generated by ox-ui-module generator.
 * Please only apply minor changes (better no changes at all) to this file
 * if you want to be able to run the generator again without much trouble.
 *
 * If you really have to change this file for whatever reason, try to contact
 * the core team and describe your use-case. May be, your changes can be
 * integrated into the templates to be of use for everybody.
 */
'use strict';

module.exports = function (grunt) {
    var languages = grunt.file.expand({
        filter: isPackagedLanguage
    }, 'i18n/*.po').map(function (fileName) {
        return fileName.match(/([a-zA-Z]+_[a-zA-Z]+).po$/)[1];
    });

    function isPackagedLanguage(file) {
        //filter all languages that should not be packaged
        //those will have something like ""X-Package: no\n"" in their header
        var content = grunt.file.read(file),
        included = !/^\s*"X-Package: (?:off|no|false|0)(?:\\n)?"\s*$/im.test(content);
        if (!included) {
            grunt.verbose.writeln('Filtered file: ', file);
        }
        return included;
    }

    function isTranslationModule(file) {
        return file.match(/\.([a-zA-Z]+_[a-zA-Z]+)\.js$/) && grunt.file.isFile(file);
    }

    function isPackagedTranslationModule(file) {
        var _ = require('underscore'),
            languagePart = file.match(/\.([a-zA-Z]+_[a-zA-Z]+)\.js$/)[1];
        return _(languages).contains(languagePart);
    }

    grunt.config.merge({
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['apps/**/*', 'manifests/**/*', '*'],
                        cwd: 'build/',
                        dest: 'dist/appsuite/',
                        filter: function (file) {
                            return !(/.*[^\.min]\.js$/.test(file));
                        }

                    },
                    {
                        expand: true,
                        src: ['**/*'],
                        cwd: 'conf/',
                        dest: 'dist/etc/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('copy_dist', grunt.util.runPrefixedSubtasksFor('copy', 'dist'));

    grunt.config.merge({
        uglify: {
            dist: {
                files: [{
                    src: ['**/*.js', '!**/*.min.js'],
                    cwd: 'build/',
                    dest: 'dist/appsuite/',
                    filter: function (f) {
                        return !isTranslationModule(f) && grunt.file.isFile(f);
                    },
                    expand: true
                }]
            },
            dist_i18n: {
                files: [
                    {
                        expand: true,
                        src: ['apps/**/*.js'],
                        cwd: 'build/',
                        dest: 'dist/appsuite/',
                        filter: isPackagedTranslationModule
                    }
                ]
            }
        }
    });

    // build a distribution ready version of the ui
    grunt.registerTask('dist:build', ['clean', 'checkDependencies:build', 'bower', 'build', 'copy_dist', 'uglify']);
    //for backwards compatibility:
    grunt.registerTask('dist', 'build a distribution ready version (DEPRECATED, use dist:build)', function () {
        grunt.verbose.warn('Using "dist" task directly has been deprecated, use "dist:build" instead');
        grunt.task.run(['dist:build']);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
};
