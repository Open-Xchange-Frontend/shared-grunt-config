'use strict';

module.exports = function (grunt) {

    function handleModuleException (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            grunt.log.error(e.toString());
            grunt.log.writeln('If installed globally, try to set environment variable NODE_PATH to your global node_modules directory');
            //TODO: windows?
            grunt.log.writeln('To find out the correct path, you can run `npm prefix -g` and append `lib/node_modules`');
            grunt.log.writeln('To combine the last hints on Linux/Mac, use: `export NODE_PATH="$(npm prefix -g)/lib/node_modules:$NODE_PATH"`');
        }
        grunt.fail.fatal('Module needed in order to continue, make sure it is installed globally and NODE_PATH is set.');
    }

    grunt.registerTask('repair:check', 'Check for several known problems', function () {
        grunt.task.run(['checkDependencies']);
    });

    grunt.registerTask('repair:bower', 'Remove bower_components directory and run `bower install`', function () {
        grunt.config('clean.bower_components', ['bower_components']);
        grunt.task.run(['clean:bower_components', 'repair:bower_install']);
    });
    grunt.registerTask('repair:bower_install', 'Run bower install', function () {
        var done = this.async();
        try {
            var bower = require('bower');
            bower.commands
                .install([], { silent: true })
                .on('end', done);
        } catch (e) {
            handleModuleException(e);
        }
    });

    grunt.registerTask('repair:npm', 'Remove node_modules directory and run `npm install`', function () {
        grunt.config('clean.node_modules', ['node_modules']);
        grunt.task.run(['clean:node_modules', 'repair:npm_install']);
    });
    grunt.registerTask('repair:npm_install', 'Run npm install', function () {
        var done = this.async();
        try {
            var npm = require('npm');
            npm.load({ silent: true }, function () {
                npm.commands.install([], done);
            });
        } catch (e) {
            handleModuleException(e);
        }
    });

    grunt.registerTask('repair', 'Try hard to get the setup into a usable state.', function () {
        grunt.task.run(['clean', 'repair:bower', 'repair:npm', 'repair:check']);
    });
};
