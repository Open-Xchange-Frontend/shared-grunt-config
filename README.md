# Shared Open-Xchange Appsuite UI module grunt configuration

[![Build Status](https://travis-ci.org/Open-Xchange-Frontend/shared-grunt-config.svg)](https://travis-ci.org/Open-Xchange-Frontend/shared-grunt-config)

This shared configuration can be used to develop modules for the Open-Xchange Appsuite UI.
It has been part of the [generator-ox-ui-module](https://github.com/Open-Xchange-Frontend/generator-ox-ui-module) project, that can
help you getting started building own modules using [yo](http://yeoman.io/), but has
been extracted to be released on its own.

If you used yo to generate a stub project, you are already setup and ready to use all the goodness.

To manually enable the shared tasks, they need to be loaded in your local `Gruntfile.js`. For this to work, you need to

```
npm install --save-dev @open-xchange/shared-grunt-config
```

This will add the shared configuration as a dependency to your project and install it.

Our recommended `Gruntfile.js` looks like this:

```
'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('@open-xchange/shared-grunt-config');

    // load custom tasks
    // those can be used to override configuration from shared-grunt-config
    if (grunt.file.isDir('grunt/tasks/')) {
        grunt.loadTasks('grunt/tasks/');
    }
};
```

The important line is `grunt.loadNpmTasks('@open-xchange/shared-grunt-config');`, which will actually load all the shared tasks.

# Tasks

Find here a few tasks that might be useful during development of an Open-Xchange Appsuite UI module.

Some of the tasks are only available, if some dependencies are present in the `node_modules/` directory of the project using
this shared configuration.

### default

This task will check for all development dependencies to be installed. If not, `npm install` will be run.
Then the [build](#build) task will be run, to provide a runnable version of the software in the `build/` directory.

### build

This is a collection of tasks needed to actually build the module. Currently it will lint the code (statically check for
problems in the code), run all `copy:build_*` tasks, run all `concat` tasks, run all `less` tasks and run `compile_po` to
generate i18n JavaScript modules from po files in `i18n/`.

### create_pot

Extract strings that are used by the `require-gettext` module (gt) from the JavaScript files and store them in `i18n/ox.pot`.
This files can be used by translators to create language specific po files to enable translation.

### dist

Create a distribution ready version in the `dist/` directory. Everything from this directory can later on
be copied over to a prefix directory and will be served correctly from there. So this directory contains
the final directory structure that just needs to be copied over to the destination.

### clean

Remove all files created temporarily during development. Installed dependencies (`node_modules/`) are
not counted as such temporary files. Those have to be removed manually, if needed.

### install:dist

Run all install tasks for production. Currently, this is an alias to run both, `install:static` and `install:dynamic` tasks.

### install:static

Install all files which should be distributed (generated by the `dist` task into `dist/` directory) into the directory specified
with the `--htdoc` command line option.
All provided files can now be served statically by a Webserver.
This task is not strictly needed if no static files are supposed to be served.
In order to deactivate this task, this can be overriden in a project by placing a file into `grunt/tasks` directory:

```JavaScript
module.exports = function (grunt) {
    // disable install:static
    // we do not need any static files served by the Webserver
    grunt.registerTask('install:static', []);
};
```

Example:

```shell
grunt dist install:static --htdoc=/var/www/
```

### install:dynamic

Install all files which should be distributed (generated by the `dist` task into `dist/` directory) into the directory specified
with the `--prefix` command line option.
All files provided by this task are supposed to be available to a middleware component for dynamic consumption.

Example:

```shell
grunt dist install:dynamic --prefix=/opt/open-xchange/
```

### bump

Use [grunt-bump](https://github.com/vojtajina/grunt-bump) to manage versioning of the project.

### less

In order to have local less files compiled against a default theme, you
would need to provide a `coreDir` variable. This can be provided via
command line or via a file in `grunt/local.conf.json`. This `coreDir`
variable needs to point to a directory containing core less files, like
a distributed version of the core UI or the core UI repository itself.

In order to build local less files against more themes, those will also be looked up from directories specified in
the `appserver.prefixes` array (local.conf).

## Development tasks (optional)

Those tasks are only available, if the following dependencies are installed:

* appserver
* grunt-contrib-connect
* grunt-contrib-watch

### dev

This task will start the [MITM (appserver) proxy](#connect) at http://localhost:8337 and serve the `build/` directory by
default. It will also start a karma server ready to run the unit tests. It will then start the [watch](#watch)
task to watch the directory for changes and act on them.

### connect

Start a MITM (appserver) proxy serving the `build/` directory by default. It will also start a livereload server, so
it is possible to trigger a reload event to all browsers that are connected to the server.

Only useful to run in combination with the watch task, like `grunt connect watch`. See [serve](#serve) for a
stand-alone version of this task.

#### Activating a proxy server

Sometimes, a production setup requires to have correct host names setup and be used to develop or debug against a system.
In such cases, it is possible to activate a proxy server that will send certain requests through the MITM (appserver) proxy
and proxy all other requests directly like *real* proxy servers (like squid) do.

In `grunt/local.conf.json` just add an entry `"proxy": true` to start a proxy server at the default port (8080). Instead of
`true`, a custom port number might be specified.

Once the `connect:proxy` task is running, a browsers proxy settings might be configured to use `localhost:8080` as a proxy
server for HTTP(S) traffic.

Drawback: when using the proxy server, _livereload_ middleware can not be used, yet. A browser plugin for livereload would
be needed in such cases, or reloads must be triggered manually.

#### Using HTTPS

To configure HTTPS protocol for the development server, switch to `"protocol": "https"` in `appserver` section of
`grunt/local.conf.json`.
Additionally, values for `key`, `cert` and `ca` can be provided.
Those will be added to the configuration of the `connect:server` subtask as documented for
[grunt-connect](https://github.com/gruntjs/grunt-contrib-connect#support-for-https).
The default settings are:

```
{
  "key": "ssl/host.key",
  "cert": "ssl/host.crt",
  "ca": "ssl/rootCA.crt"
}
```

Those values might point to files that are automatically read or raw PEM data.

### watch

Watch certain directories for changes and trigger tasks when any change happens. This will trigger a [build](#build),
once any of the source files have changed, then it will send a livereload event to all browsers connected to the
MITM (appserver) proxy and finally it will issue a [test run](#testrun).

If some grunt configuration changes, grunt will reload itself.

If some files in the `spec/` directory changes, those will be copied to the `build/` directory and a [test run](#testrun)
will be initiated.

### refresh

Force a reload of the UI (incl. cache busting) in a browser that has a connection to a running livereload server.
This helps during development, if `grunt dev` is used (or at least the watch task is running). A call to
`grunt refresh` will then reload the browser window with the latest code served by the connect middleware.

### serve

Run the [connect](#connect) task but wait for ever after the server has been started. Use this to run a MITM proxy
without the [watch](#watch) task.

### install

In order to test files in semi-production environments before `uglify` task has run, all files from `build/` directory can
be installed to some arbitrary location using this task.
The `--dest` command line option is mandatory in this case.

Example:

```shell
grunt default install --dest=~/public_html/appsuite/
```

## Troubleshooting (repair) tasks (optional)

Those tasks do not have any new direct dependencies, but are targeting the tasks used for development.
The intention behind those tasks is to support detection of common pitfalls and repair them if possible.
None of those tasks will do any destructive operation, except when called with the `--force` option.

### repair:npm

Wipe the `node_modules/` directory followed by an `npm install`.

### repair:check_insecure_tls

Check for potential problems with TLS connections and the appserver proxy component.
Sometimes, the server to develop against does not provide valid TLS certificates.
Be it, because it is a development machine, or for any other reason.
In order to still use the server, there is a new option, allowing to accept untrusted connections
in the proxy server.

To reset this to the default, remove `appserver.rejectUnauthorized` option  from `grunt/local.conf.json` or set it to `true`.

### repair:check_local_conf

Make sure the file `grunt/local.conf.json` exists.
This will create the file with a default configuration, if it did not exist.
It will **not** overwrite any custom configuration.

### repair:check

Run all the `repair:check_*` tasks mentioned above.

### repair

Run all `repair:*` tasks mentioned above.
Use the `--read-only` option for a "read-only" version, which will just print out potential problems.

## (Unit-)Testing (optional)

Those tasks are only available, if the following dependencies are installed:

* grunt-karma

### karma:continuous

Run all tests from `spec/` directory once in phantomjs browser.

### karma:serve

Start an instance of the karma test server and wait for browser connecting to http://localhost:9876. By default,
a phantomjs browser will connect this URL automatically.

### testrun

Start a testrun on a running [testserver](#karma:serve) and run the tests on all browsers connected to
http://localhost:9876. It will skip the testrun, if no server is found running.

## I18n (optional)

Those tasks are only available, if the following dependencies are installed:

* grunt-exec
* gettext tools installed globally (msgmerge)

### msgmerge

Perform a msgmerge operation in the `i18n/` directory. This will merge all
changes from the pot file in the `i18n/` directory into all po files found.

