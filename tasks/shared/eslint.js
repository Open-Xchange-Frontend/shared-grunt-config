/**
* This work is provided under the terms of the CREATIVE COMMONS PUBLIC
* LICENSE. This work is protected by copyright and/or other applicable
* law. Any use of the work other than as authorized under this license
* or copyright law is prohibited.
*
* http://creativecommons.org/licenses/by-nc-sa/2.5/
* © 2016 OX Software GmbH, Germany. info@open-xchange.com
*
* @author David Bauer <david.bauer@open-xchange.com>
*/

'use strict';

module.exports = function (grunt) {

    grunt.config.merge({
        eslint: {
            all: {
                files: [{
                    expand: true,
                    src: [
                        'Gruntfile.js', 'grunt/tasks/*.js', 'apps/**/*.js', 'src/*.js', 'spec/**/*.js'
                    ],
                    filter: 'isFile'
                }]
            }
        }
    });

    grunt.util.registerDummyTask('eslint', 'grunt-eslint');
    if (grunt.isPeerDependencyInstalled('grunt-eslint'))
        grunt.loadNpmTasks('grunt-eslint');
};
