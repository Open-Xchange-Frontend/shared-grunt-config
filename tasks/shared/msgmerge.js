'use strict';

module.exports = function (grunt) {

    if (!grunt.isPeerDependencyInstalled('grunt-exec')) {
        grunt.verbose.warn('Skipping optional msgmerge tasks');
        return;
    }

    grunt.config.merge({
        exec: {
            msgmerge: {
                cmd: function () {
                    return 'for i in i18n/*.po; do\n' +
                           'msgmerge -Us --previous --backup=none "$i" i18n/ox.pot\n' +
                           'done';
                },
                //msgmerge command writes to stderr (aehm?), remove output
                stderr: false
            }
        }
    });

    grunt.registerTask('msgmerge', 'Perform msgmerge operation on all po files in i18n/', ['exec:msgmerge']);

    grunt.loadNpmTasks('grunt-exec');
};
