/**
 * Created by chenwj@ucweb.com on 2015/2/10.
 *
 */


module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ngAnnotate: {
            libs: {
                files: [
                    {
                        src: ['build/angular-wysiwyg.js'],
                        dest: 'build/angular-wysiwyg.ng.js'
                    }
                ]
            }
        },
        uglify: {
            libs: {
                files: [
                    {
                        src: ['build/angular-wysiwyg.ng.js'],
                        dest: 'angular-wysiwyg.min.js'
                    }
                ]
            }
        },
        clean: {
            build: ['build']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['ngAnnotate', 'uglify', 'clean']);
};