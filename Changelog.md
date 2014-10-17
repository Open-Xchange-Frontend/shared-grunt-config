# Changelog

### v0.9.0

* update appserver to latest version
    * adds the option to provide a custom index file
    * adds /ui as another way to start AppSuite (new in version 7.8.0)

### v0.8.0

* version bump of grunt-require-gettext -> more stable handling of po files
* add configuration for jscs
    * not active by default, but possible to enable it easily
* add jsonlint task for spec/ directory -> lint your fixture files
* documentation cleanup

### v0.7.0

* prepared everything to publish this config also through npm registry
* changed behaviour:
    - removed white-list for files copied from apps/ to build/apps/
    - **all** files from apps/ are now copied to build/apps/
    - running tests: remove recently introduced “always run tests” behaviour, again
    - running tests: optionally disable testserver for dev task (use --no-tests)
* minor: add `grunt/local.conf.json` to watched files

### v0.6.4

* fix issue with some (json) files not being copied

### v0.6.3

* fix minor issue with testrun and no karma configured (will not fail any longer)
* hidden feature: it is now possible to extend karma configuration via grunt/local.conf.json
* be more strict with copy:dist and uglify configuration: only write final js files once.

### v0.6.2

* update grunt-check-dependencies to latest version (0.6.0)
* update grunt-contrib-clean to latest version (0.6.0)
* update grunt-contrib-uglify to latest version (0.5.1)
* update grunt-contrib-concat to latest version (0.5.0)
* extend testrun task to always run tests

### v0.6.1

* update grunt-bower-task to latest version (0.4.0)

### v0.6.0

* update grunt-require-gettext to latest version
    * brings features and new bug-fixes
* new msgmerge task
    * merge pot file with all po files in `i18n/` directory
* better support for local packaging
* more documentation
* deprecate grunt.config.extend, switch to grunt.config.merge (native grunt API)

### v0.5.3

* expose appserver and coreDir local configuration to karma targets
    * used for more easy testing with new karma-ox-ui module

### v0.5.2

* fix issue with coreThemes detection on windows
* add grunt-require-gettext cache dir to clean task

### v0.5.1

* fix minor issues in less task
* fix issue with newer:copy:specs not copying files

### v0.5.0

* improvements in serve task configuration
    * unneeded path removed
    * look for manifests directory in all prefix directories by default
* feature: force_update task: use new appserver feature to set latest build timestamp
* run copy_dist before uglify task, so copy_dist will not overwrite any generated files
* add default task to dev task (this will build the module before running the dev tasks)
* fixes for dist:source task

### v0.4.2

* fix less task not working in core directory

### v0.4.1

* fix watch task for manifest files

### v0.4.0

* incompatible changes for less tasks
    * coreDir option is mandatory
    * default value for coreDir is build/
    * dependencies (bootstrap, bootstrap-datepicker and font-awesome) are now expected to be found within coreDir, not bower_components
    * benefit: plugins do not need to ship those dependencies for build-time, any longer (can be removed from bower.json)
* rootpath in less is now used for cache-busting (version is appended, now)
* files from spec/ directory are now copied by default
* overwrite copy task, so it can not be run on its own
    * prevents people from copying unwanted files into their repo

### v0.3.1

* update appserver to 0.2.0
    * inject manifests into rampup data of login servlet

### v0.3.0

* add mode option for install tasks (file mode will stay as is)
* documentation
* coreDir now mandatory for less task to do something
* make all copy subtasks extendeble more easy
    * this needs `copy:apps` and `copy:themes` to be renamed to `copy:build_apps` and `copy:build_themes`
* dist task is deprecated, use dist:build instead
* new tasks to support packaging
* fix some issues

### < v0.3.0

undocumented, see git log for details
