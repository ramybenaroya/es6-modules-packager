module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	var config = require('load-grunt-config')(grunt, {
			configPath: 'tasks/options',
			init: false,
		});


	grunt.loadTasks('tasks');

	this.registerTask('default', ['watcher']);
	this.registerTask('build', ['build:prod']);

	// Run client-side tests on the command line.
	this.registerTask('test', 'Runs tests through the command line using PhantomJS', [
		'build:dev', 'tests', 'connect'
	]);

	// Run a server. This is ideal for running the QUnit tests in the browser.
	this.registerTask('server', ['build:dev', 'tests', 'connect', 'watch:server']);
	this.registerTask('watcher', ['build:dev', 'tests', 'watch:server']);
	this.registerTask('server:prod', ['build:prod', 'tests', 'connect', 'watch:server']);

	// Build test files
	this.registerTask('tests', 'Builds the test package', ['transpile:testsAmd', 'buildTests:dist']);

	// Build a new version of the modules
	this.registerTask('build:prod', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'jshint',
		'transpile:prod',
		'uglify:prod',
		'concat:vendor',
		'uglify:packages',
		'uglify:vendor'
	]);

	this.registerTask('build:dev', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'jshint',
		'transpile:dev',
		'concat:vendor'
	]);
	this.registerTask('build:dev:slim', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:slim',
		'jshint',
		'transpile:dev',
	]);

	// Custom phantomjs test task

	// Custom Node test task
	this.registerTask('test', ['build', 'tests', 'mochaTest']);

	this.registerTask('docs', ['groc']);

	config.env = process.env;
	config.pkg = grunt.file.readJSON('package.json');

	// Load custom tasks from NPM
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-groc');


	// Merge config into emberConfig, overwriting existing settings
	grunt.initConfig(config);
};