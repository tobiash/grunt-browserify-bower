/*
 * grunt-browserify-bower
 * https://github.com/tobiash/grunt-browserify-bower
 *
 * Copyright (c) 2013 Tobias Habermann
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    extend = require('extend'),
    browserify = require('browserify'),
    shim = require('browserify-shim'),
    bowerResolve = require('bower-resolve'),
    bower = require('bower');

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('browserifyBower', 'Browserify bower libraries into a separate bundle', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      file: './.tmp/scripts/lib.js',
      forceResolve: {},
      shim: {},
      debug: false,
      insertGlobals: true,
      detectGlobals: false,
      standalone: "",
      insertGlobalVars: false,
      checkVersions: true
    });

    var file = options.file,
      forceResolve = options.forceResolve,
      shims = {},
      fromBower = [],
      fromExtra = [];

    var done = this.async(),
        b = browserify(),
        flags = this.flags;


    function brResolve(name) {
      if (forceResolve[name]) {
        return path.resolve(bower.config.directory, name, forceResolve[name]);
      }
      return path.resolve(bowerResolve(name));
    }

    function processBowerDependency(name) {
      var depPath = brResolve(name);
      grunt.log.debug('Resolved %s to %s', name, depPath);
      if (depPath.indexOf('.js', depPath.length - 3) === -1) {
        grunt.log.debug('Did not resolve to .js, ignoring %s', name);
        return;
      }
      if (!fs.existsSync(depPath)) {
        grunt.log.warn('Path %s for package %s not found, ignoring', depPath, name);
        return;
      }
      var depShim = {
            exports: null,
            path: depPath
          };
      // Allow for customization of the generated shim
      extend(true, depShim, options.shim[name]);
      fromBower.push(name);
      shims[name] = depShim;
    }

    function bundle() {
      grunt.log.debug('%j', shims);
      b = shim(b, shims);
      return b.bundle(options);
    }

    bowerResolve.offline = !options.checkVersions;
    bowerResolve.init(function () {

      bower.commands.list().on('end', function (info) {
        Object.keys(info.dependencies).forEach(processBowerDependency);

        // Shim other dependencies (outside bower)
        Object.keys(options.shim).forEach(function (name) {
          if (fromBower.indexOf(name) < 0) {
            shims[name] = options.shim[name];
            fromExtra.push(name);
          }
        });

        grunt.file.mkdir(path.dirname(file));
        grunt.config.set('browserify.options.external', fromBower.concat(fromExtra));

        if (flags.nowrite) {
          done();
          return;
        }

        bundle()
          .pipe(fs.createWriteStream(file))
          .on('finish', function () {
            grunt.log.ok('Wrote %d bower and %d external dependencies to %s', fromBower.length, fromExtra.length, file);
            done();
          })
          .on('error', function (err) {
            grunt.log.writeln('Error bundling bower components', err.stack);
            done(err);
          });
      }).on('error', function (err) {
        grunt.log.writeln('Error listing bower components', err);
        done(err);
      });

    });


    // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   // Concat specified files.
    //   var src = f.src.filter(function(filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));

    //   // Handle options.
    //   src += options.punctuation;

    //   // Write the destination file.
    //   grunt.file.write(f.dest, src);

    //   // Print a success message.
    //   grunt.log.writeln('File "' + f.dest + '" created.');
    // });
  });

};
