'use strict';
module.exports = function (grunt) {

    var sign_options = grunt.option('no-sign') === true ? ' -us -uc' : '';

    grunt.config.merge({
        exec: {
            dpkg_build: {
                cmd: 'dpkg-buildpackage -b' + sign_options,
                cwd: 'dist/<%= pkg.name %>-<%= pkg.version %>/'
            },
            rpmbuild: {
                cmd: 'cp dist/*.orig.tar.* ~/rpmbuild/SOURCES/; cp dist/*.spec ~/rpmbuild/SOURCES; rpmbuild -bb dist/<%= pkg.name %>.spec'
            }
        }
    });

    grunt.registerTask('dpkg-buildpackage', 'create installable deb packages based on all packaging information', function () {
        grunt.task.run(['dist:source', 'dist:dpkg-source', 'exec:dpkg_build']);
    });

    grunt.registerTask('rpm-build', 'create installable rpm packages based on all packaging information', function () {
        grunt.task.run(['dist:source', 'dist:rpm', 'exec:rpmbuild']);
    });

    grunt.util.registerDummyTask('exec', 'grunt-exec');
    if (grunt.isPeerDependencyInstalled('grunt-exec')) {
        grunt.loadNpmTasks('grunt-exec');
    }
};
