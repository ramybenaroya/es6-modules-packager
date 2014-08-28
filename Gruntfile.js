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
	this.registerTask('server', ['build:dev', 'connect', 'concurrent:dev']);
	this.registerTask('watcher', ['build:dev', 'concurrent:dev']);
	this.registerTask('server:prod', ['build:prod', 'connect', 'concurrent:prod']);
	this.registerTask('watcher:prod',  ['build:prod', 'concurrent:prod']);

	// Build test files
	this.registerTask('tests', 'Builds the test package', ['transpile:testsAmd', 'buildTests:dist']);

	// Build a new version of the modules
	this.registerTask('build:prod', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'jshint',
		'transpile:prod',
		'uglifyModules',
		'uglifyPackagedModules',
		'uglifyJsPackages',
		'generate_includers:js:prod',
		'compass:compile',
		'minifyCssPackages',
		'generate_includers:css:prod',
		'generateRequireConfig:prod',
		'generate_includers:clean',
		'generate_includers:html'
	]);
	this.registerTask('build:prod:spec', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'build:prod:modules',
		'uglifyJsPackages',
		'generate_includers:js:prod',
		'minifyCssPackages',
		'generate_includers:css:prod',
		'generateRequireConfig:prod',
		'generate_includers:clean',
		'generate_includers:html'
	]);

	this.registerTask('build:dev', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'jshint',
		'transpile:dev',
		'generate_includers:js:dev',
		'compass:compile',
		'generate_includers:css:dev',
		'generateRequireConfig:dev',
		'generate_includers:clean',
		'generate_includers:html'
	]);
	this.registerTask('build:dev:spec', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'build:dev:modules',
		'generate_includers:js:dev',
		'generate_includers:css:dev',
		'generateRequireConfig:dev',
		'generate_includers:clean',
		'generate_includers:html'
	]);
	this.registerTask('build:dev:modules', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:modules',
		'jshint',
		'transpile:dev',
	]);
	this.registerTask('build:prod:modules', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:modules',
		'jshint',
		'transpile:prod',
		'uglifyModules',
		'uglifyPackagedModules'
	]);

	this.registerTask('build:prod:js_packages', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:js',
		'uglifyJsPackages'
	]);

	this.registerTask('build:prod:css', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:css',
		'minifyCssPackages'
	]);



	// Custom phantomjs test task

	// Custom Node test task
	this.registerTask('test', ['build', 'tests', 'mochaTest']);

	this.registerTask('docs', ['clean:docs', 'groc']);

	config.env = process.env;
	config.pkg = grunt.file.readJSON('package.json');
	config.build = grunt.file.readJSON('config/build.json');

	// Load custom tasks from NPM
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-groc');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	// Merge config into emberConfig, overwriting existing settings
	grunt.initConfig(config);
};