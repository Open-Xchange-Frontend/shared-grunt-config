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

    //TODO: remove work-around for deprecated tasks
    grunt.registerTask('newer:copy:apps', function () {
        grunt.log.warn('DEPRECATED: newer:copy:apps task is deprecated, use newer:copy:build_apps instead!');
        grunt.log.warn('see Changelog entry for v0.3.0 on https://github.com/Open-Xchange-Frontend/shared-grunt-config/blob/master/README.md')
        grunt.task.run('newer:copy:build_apps');
    });
    grunt.registerTask('newer:copy:themes', function () {
        grunt.log.warn('DEPRECATED: newer:copy:themes task is deprecated, use newer:copy:build_themes instead!');
        grunt.log.warn('see Changelog entry for v0.3.0 on https://github.com/Open-Xchange-Frontend/shared-grunt-config/blob/master/README.md')
        grunt.task.run('newer:copy:build_themes');
    });
    grunt.registerTask('copy:apps', function () {
        grunt.log.warn('DEPRECATED: copy:apps task is deprecated, use copy:build_apps instead!');
        grunt.log.warn('see Changelog entry for v0.3.0 on https://github.com/Open-Xchange-Frontend/shared-grunt-config/blob/master/README.md')
        grunt.task.run('copy:build_apps');
    });
    grunt.registerTask('copy:themes', function () {
        grunt.log.warn('DEPRECATED: copy:themes task is deprecated, use copy:build_themes instead!');
        grunt.log.warn('see Changelog entry for v0.3.0 on https://github.com/Open-Xchange-Frontend/shared-grunt-config/blob/master/README.md')
        grunt.task.run('copy:build_themes');
    });

    grunt.config.extend('copy', {
        build_apps: {
            files: [
                {
                    src: ['apps/**/*.js'],
                    expand: true,
                    filter: 'isFile',
                    dest: 'build/'
                }
            ]
        },
        build_themes: {
            files: [
                {
                    expand: true,
                    src: ['**/*.{png,gif,ico,less,css}'],
                    cwd: 'apps/',
                    dest: 'build/apps/',
                    filter: 'isFile'
                }
            ]
        }
    });

    grunt.registerTask('copy_build', grunt.util.runPrefixedSubtasksFor('newer:copy', 'build'));

    grunt.loadNpmTasks('grunt-contrib-copy');
};
