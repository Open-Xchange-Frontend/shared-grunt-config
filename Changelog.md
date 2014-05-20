# Changelog

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
