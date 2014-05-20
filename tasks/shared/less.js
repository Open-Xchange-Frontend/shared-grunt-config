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
    var path = require('path');
    var coreDir = grunt.option('coreDir') || grunt.config('local.coreDir') || '';

    // coreDir needs to be relative to the current working directory, because less doesn't like absolute paths
    // for @import statements (see http://stackoverflow.com/questions/10715214/lessc-with-an-absolute-path-in-importing)
    coreDir = path.relative(process.cwd(), coreDir);

    //TODO: get rid of coreDir dependency for less files
    //if no coreDir is specified, compile everything for 'default' theme, this can be used
    //with local versions of core definitions.less, mixins.less and style.less.
    //Just place those files in lib/appsuite/apps/themes/
    var coreThemes = (coreDir ?
        grunt.file.expand({cwd: path.join(coreDir, 'apps/themes/')}, '*/definitions.less') : []
    ).map(function (file) {
        return file.replace(/\/definitions.less$/, '');
    });
    var localThemes = grunt.file.expand({cwd: 'apps/themes/'}, '*/definitions.less').map(function (file) {
        return file.replace(/\/definitions.less$/, '');
    });

    function optionsFor(themeName) {
        return {
            compress: !grunt.config('local.debug'),
            cleancss: !grunt.config('local.debug'),
            ieCompat: false,
            syncImport: true,
            strictMath: false,
            strictUnits: false,
            relativeUrls: false,
            paths: [
                'bower_components/bootstrap/less',
                'bower_components/font-awesome/less',
                'lib/appsuite/apps/themes',
                path.join(coreDir, 'apps/themes'),
                'apps/themes',
            ],
            imports: {
                reference: [
                    'variables.less',
                    'mixins.less'
                ],
                less: [
                    'definitions.less',
                    themeName + '/definitions.less'
                ]
            }
        };
    }

    localThemes.forEach(function (themeName) {
        var theme = {};

        theme[themeName] = {
            options: optionsFor(themeName),
            files: [
                {
                    src: [
                        'bower_components/bootstrap/less/bootstrap.less',
                        'bower_components/bootstrap-datepicker/less/datepicker3.less',
                        'bower_components/font-awesome/less/font-awesome.less',
                        path.join(coreDir, 'apps/themes/style.less')
                    ],
                    expand: true,
                    rename: function (dest) { return dest; },
                    filter: function (name) {
                        if (!grunt.file.exists(name)) {
                            grunt.log.warn('Building local themes without a --coreDir option is not supported, at the moment');
                        }
                        return grunt.file.exists(path.join(coreDir, 'apps/themes/style.less'));
                    },
                    dest: 'build/apps/themes/' + themeName + '/common.css',
                    nonull: true
                },
                {
                    src: [
                        'apps/themes/' + themeName + '/style.less'
                    ],
                    expand: true,
                    rename: function (dest) { return dest; },
                    filter: function () {
                        //only generate this file if there is a style.less for this theme
                        return grunt.file.exists(path.join(coreDir, 'apps/themes/style.less')) &&
                               grunt.file.exists('apps/themes/' + themeName + '/style.less');
                    },
                    dest: 'build/apps/themes/' + themeName + '/style.css'
                },
                {
                    src: ['**/*.less', '!themes/**/*.less', '!themes/*.less'],
                    expand: true,
                    ext: '.css',
                    cwd: path.join(coreDir, 'apps/'),
                    filter: function () {
                        return grunt.file.exists(path.join(coreDir, 'apps/themes/style.less'));
                    },
                    dest: 'build/apps/themes/' + themeName + '/'
                },
                {
                    src: ['**/*.less', '!themes/**/*.less', '!themes/*.less'],
                    expand: true,
                    ext: '.css',
                    cwd: 'apps/',
                    filter: function () {
                        return grunt.file.exists(path.join(coreDir, 'apps/themes/style.less'));
                    },
                    dest: 'build/apps/themes/' + themeName + '/'
                }
            ]
        };
        grunt.config.extend('less', theme);
    });

    coreThemes.forEach(function (themeName) {
        var theme = {};
        theme['core_theme/' + themeName + '+local_less'] = {
            options: optionsFor(themeName),
            files: [
                {
                    src: ['**/*.less', '!themes/**/*.less', '!themes/*.less'],
                    expand: true,
                    ext: '.css',
                    cwd: 'apps/',
                    dest: 'build/apps/themes/' + themeName + '/'
                }
            ]
        };
        grunt.config.extend('less', theme);
    });

    //init empty less config, if no themes detected, this will prevent grunt-newer
    //from failing
    grunt.config.extend('less', {});

    grunt.loadNpmTasks('assemble-less');
};
