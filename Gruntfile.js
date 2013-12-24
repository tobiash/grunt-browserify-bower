/*
 * grunt-browserify-bower
 * https://github.com/tobiash/grunt-browserify-bower
 *
 * Copyright (c) 2013 Tobias Habermann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    browserifyBower: {
      options: {
        file: './tmp/lib.js',
        // fix broken bower `main` entries
        forceResolve: {
          'wysihtml5': 'dist/wysihtml5-0.3.0.min.js'
        },
        shim: {
          'wysihtml5': {
            exports: 'wysihtml5'
          }
        }
      },
      default: {
      },
      custom_options: {
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'browserifyBower', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
