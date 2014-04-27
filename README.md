# Shared Open-Xchange Appsuite UI module grunt configuration

This shared configuration can be used to develop modules for the Open-Xchange Appsuite UI.
It has been part of the [generator-ox-ui-module](https://github.com/Open-Xchange-Frontend/generator-ox-ui-module) project, that can
help you getting started building own modules using [yo](http://yeoman.io/), but has
been extracted to be released on its own.

# Tasks

Find here a few tasks that might be useful during development of an Open-Xchange Appsuite UI module.

## default

This task will check for all development dependencies to be installed. If not, `npm install` will be run.
After that, all bower components are checked, `bower install` will be run, if needed.
Then the [build](#build) task will be run, to provide a runnable version of the software in the `build/` directory.

## dev

This task will start the [MITM (appserver) proxy](#connect) at http://0.0.0.0:8337 and serve the `build/` directory by
default. It will also start a karma server ready to run the unit tests. It will then start the [watch](#watch)
task to watch the directory for changes and act on them.

## connect

Start a MITM (appserver) proxy serving the `build/` directory by default. It will also start a livereload server, so
it is possible to trigger a reload event to all browsers that are connected to the server.

Only useful to run in combination with the watch task, like `grunt connect watch`. See [serve](#serve) for a
stand-alone version of this task.

## watch

Watch certain directories for changes and trigger tasks when any change happens. This will trigger a [build](#build),
once any of the source files have changed, then it will send a livereload event to all browsers connected to the
MITM (appserver) proxy and finally it will issue a [test run](#testrun).

If some grunt configuration changes, grunt will reload itself.

If some files in the `spec/` directory changes, those will be copied to the `build/` directory and a [test run](#testrun)
will be initiated.

## serve

Run the [connect](#connect) task but wait for ever after the server has been started. Use this to run a MITM proxy
without the [watch](#watch) task.

## karma:serve

Start an instance of the karma test server and wait for browser connecting to http://localhost:9876. By default,
a phantomjs browser will connect this URL automatically.

## testrun

Start a testrun on a running [testserver](#karma:serve) and run the tests on all browsers connected to
http://localhost:9876. It will skip the testrun, if no server is found running.

## build

## dist

## clean

## install:dist

## install:static

## install:dynamic

## bump


