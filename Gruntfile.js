module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    var config = require('load-grunt-config')(grunt, {
        configPath: 'tasks/options',
        init: false,
    });

    grunt.loadTasks('tasks');

    this.registerTask('default', ['build']);

    // Run client-side tests on the command line.
    this.registerTask('test', 'Runs tests through the command line using PhantomJS', [
        'build', 'tests', 'connect'
    ]);

    // Run a server. This is ideal for running the QUnit tests in the browser.
    this.registerTask('server', ['build', 'tests', 'connect', 'watch:server']);

    // Build test files
    this.registerTask('tests', 'Builds the test package', ['transpile:testsAmd', 'buildTests:dist']);

    // Build a new version of the modules
    this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
        'clean',
        'jshint',
        'transpile:amd',
        'concat:amd',
        'concat:vendor',
        'uglify:amd',
        'uglify:vendor'
    ]);

    // Custom phantomjs test task

    // Custom Node test task
    this.registerTask('test', ['build', 'tests', 'mochaTest']);

    // Custom YUIDoc task
    this.registerTask('docs', ['yuidoc']);

    config.env = process.env;
    config.pkg = grunt.file.readJSON('package.json');

    // Load custom tasks from NPM
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');


    // Merge config into emberConfig, overwriting existing settings
    grunt.initConfig(config);
};