ES6 Modules Packager
=====

## Toolchain workflow

### Build

* Begin with scripts in a `root` directory
* Transpile ES6 modules to AMD
* Transpile ES6 modules to CommonJS
* Concatenate AMD
* Concatenate CommonJS
* Concatenate a build for the browser
* Run concatenated builds through Traceur
* Export builds to window
* Uglify browser build
* Copy over an index.html to run

## Features

* ES6 module transpiler + setup (AMD, CJS)
* Traceur compiler + setup
* JSHint linting
* Concat + Uglify
* Mocha + PhantomJS for unit testing
* YUIDoc
* Watch task

