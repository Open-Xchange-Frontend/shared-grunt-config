/*
 * grunt-show-config
 *
 * Copyright (c) 2013 Mark Parolisi
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';
    var desc = 'Prints the Grunt configuration object.\nCan optionally add a argument :task to show that task\'s configuration';
    grunt.registerTask('show-config', desc, function (task) {
        var configObject, target;
        configObject = grunt.config.get();
        if (task) {
            if (configObject[task]) {
                configObject = configObject[task];
            } else {
                grunt.fatal(task + ' does not have any configurations');
            }
        }
	target = grunt.option('output');
        if (target) {
            grunt.log.writeln('Config written to file:', target);
            grunt.file.write(target, JSON.stringify(configObject, null, 4));
        } else {
            grunt.log.writeln(JSON.stringify(configObject, null, 4));
        }
    });
};
