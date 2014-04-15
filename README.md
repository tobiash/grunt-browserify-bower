# grunt-browserify-bower

> Browserify bower libraries into a separate bundle. Can be used
> together with grunt-browserify to externalize libraries into a
> separate file and speed up bundling of your application.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-browserify-bower --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-browserify-bower');
```

## The "browserifyBower" task

### Overview
In your project's Gruntfile, add a section named `browserifyBower` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  browserifyBower: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

The task browserifies all installed bower packages and optionally uses
`browserify-shim` to shim non CommonJS libraries. All these libraries
are browserified into a separate 'libs' bundle for your web app. The
task automatically sets `grunt-browserify`'s `options.external` setting.

#### Why should you use this?

* Your main browserify task runs a lot faster when it doesn't have to
repackage large library files like JQuery and AngularJS each time. This
makes your development cycle a lot more responsive.
* Libraries are a lot easier to integrate in your project. For most
libraries it's as simple as `bower install foo` and `require(foo)` in
your application.

### Options

#### options.file
Type: `String`
Default value: `'./.tmp/scripts/lib.js'`

Path of the destination file.

#### options.checkVersions
Type: `Boolean`
Default value: `true`

Simple switch to enable/disable version checking of installed bower components.
You might want to disable this to make whole process faster, especially with
bigger number of components.

**Note:** If you are running on Windows and you don't have Git client available
system wide, you should disable this, otherwise whole process might just fail.

#### options.forceResolve
Type: `Object`
Default value: `{}`

This object allows to adjust the path to the `main` file of a bower
package, in case the one specified in the package's `bower.json` is
faulty. The path should be relative to the package directory.

Example:
```js
forceResolve: {
  'wysihtml5': 'dist/wysihtml5-0.3.0.min.js'
}
```

#### options.shim
Type: `Object`
Default value: `{}`

This object allows adjusting the options passed to `browserify-shim`.

You can add entries for every library installed via bower. For these,
you should omit the `path` setting, as this is automatically determined
via `bower-resolve` or the `forceResolve` option.

Note that the `exports` setting defaults to `null` and needs to be
adjusted if you want to shim a non CommonJS library that exports to
the `window` object.

You can also add entries for libraries not installed via bower. These
are passed to `browserify-shim` directly and you need to specify a
`path` in this case.

### Usage Examples
```js
grunt.initConfig({
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
    }
  }
})
```

### Usage with `grunt-watch` or `grunt-este-watch`

If you want to rebundle your application every time one of your `.js`
files changes, but not rebuild your library bundle, you can run the task
with the `nowrite` flag. This sets the `browserify.exports` setting
according to your installed bower libs, but suppresses the rebundling of
your library bundle.

Example (with `grunt-watch`):
```js
grunt.initConfig({
  watch: {
      browserify: {
        files: 'app/scripts/**/*.js',
        tasks: ['browserifyBower:libs:nowrite', 'browserify:app']
      }
  }
})
```

#### Default Options

```js
grunt.initConfig({
  browserifyBower: {
    options: {
      file: './.tmp/scripts/lib.js',
      forceResolve: {},
      shim: {}
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
See `CHANGELOG.md`
