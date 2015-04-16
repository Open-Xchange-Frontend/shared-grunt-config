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
        grunt.task.run(['checkDependencies', 'repair:check_local_conf', 'repair:check_insecure_tls']);
    });

    grunt.registerTask('repair:check_insecure_tls', 'Check for the insecure TLS setting', function () {
        if (grunt.config('local.appserver.rejectUnauthorized') === undefined || grunt.config('local.appserver.rejectUnauthorized') === true) {
            grunt.log.oklns('Appserver will reject unauthorized connections to the backend. This is good from a security point of view, but might not work if TLS is not setup properly.');
            grunt.log.warn(grunt.log.wraptext(80, 'If you are experiencing problems regarding TLS and certificate verification connecting to your development backend, add `"rejectUnauthorized": false` in your `grunt/local.conf.json` in the `appserver` section.'));
        }
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

    grunt.registerTask('repair:check_local_conf', 'Make sure local.conf.json exists', function () {
        if (!grunt.file.exists('grunt/local.conf.json')) {
            grunt.option('output', 'grunt/local.conf.json');
            grunt.task.run(['show-config:local']);
        }
    });

    grunt.registerTask('repair', 'Show some information about all repair tasks', function () {
        if (grunt.cli.tasks.length !== 1 && grunt.cli.tasks[0] === 'repair') {
            grunt.fail.fatal('Please do only run the repair task all alone.');
        }
        if (this.args.length > 0) {
            grunt.log.writeln('Check `grunt --help | grep repair` to find a list of repair:* tasks');
            grunt.log.writeln('To run all repair tasks, use `grunt repair` without any arguments.');
            grunt.fail.warn('Unknown repair task(s):', this.args.join(', '));
        }
        var tasks = [];
        if (!grunt.option('read-only')) {
            tasks = tasks.concat(['clean', 'repair:bower', 'repair:npm', 'repair:check', 'build']);
        } else {
            grunt.config('checkDependencies.bower.options.install', false);
            tasks = tasks.concat(['repair:check']);
        }

        grunt.task.run(tasks);
    });
};
