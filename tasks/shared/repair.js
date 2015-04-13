'use strict';

module.exports = function (grunt) {

    grunt.registerTask('repair:check', 'Check for several known problems', function () {
        grunt.task.run(['checkDependencies']);
    });

    grunt.registerTask('repair:bower', 'Remove bower_components directory and run `bower install`', function () {
        grunt.config('clean.bower_components', ['bower_components']);
        grunt.task.run(['clean:bower_components', 'repair:bower_install']);
    });
    grunt.registerTask('repair:bower_install', 'Run bower install', function () {
        var done = this.async();
        var bower = require('bower');
        bower.commands
            .install([], { silent: true })
            .on('end', done);
    });

    grunt.registerTask('repair:npm', 'Remove node_modules directory and run `npm install`', function () {
        grunt.config('clean.node_modules', ['node_modules']);
        grunt.task.run(['clean:node_modules', 'repair:npm_install']);
    });
    grunt.registerTask('repair:npm_install', 'Run npm install', function () {
        var done = this.async();
        var npm = require('npm');
        npm.load({ silent: true }, function () {
            npm.commands.install([], done);
        });
    });

    grunt.registerTask('repair', 'Try hard to get the setup into a usable state.', function () {
        grunt.task.run(['clean', 'repair:bower', 'repair:npm', 'repair:check']);
    });
};
