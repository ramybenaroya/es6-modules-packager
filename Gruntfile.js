module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	var config = require('load-grunt-config')(grunt, {
		configPath: 'tasks/options',
		init: false,
	});

	grunt.loadTasks('tasks');

	this.registerTask('default', ['watcher']);
	this.registerTask('watcher', ['watcher:dev']);
	this.registerTask('server', ['server:dev']);
	this.registerTask('build', ['build:prod']);

	// Run client-side tests on the command line.
	this.registerTask('test', 'Runs tests through the command line using PhantomJS', [
		'build:dev', 'tests', 'connect'
	]);

	// Run a server. This is ideal for running the QUnit tests in the browser.
	this.registerTask('server:dev', ['enable_force','build:dev', 'connect', 'concurrent:dev']);
	this.registerTask('watcher:dev', ['enable_force','build:dev', 'concurrent:dev']);
	this.registerTask('server:prod', ['enable_force','build:prod', 'connect', 'concurrent:prod']);
	this.registerTask('watcher:prod',  ['enable_force','build:prod', 'concurrent:prod']);

	// Build test files
	this.registerTask('tests', 'Builds the test package', ['transpile:testsAmd', 'buildTests:dist']);

	// Build a new version of the modules
	this.registerTask('build:prod', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'hint',
		'transpile:prod',
		'uglifyjs:single_modules',
		'uglifyjs:packaged_modules',
		'uglifyjs:js_packages',
		'generate_includers:js:prod',
		'compass:compile',
		'cssmin:css_packages',
		'generate_includers:css:prod',
		'generateRequireConfig:prod',
		'generate_resources_params_includer:prod',
		'generate_includers:html'
	]);
	this.registerTask('build:prod:spec', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'enable_force',
		'hint',
		'generate_includers:livereload',
		'build:prod:modules',
		'uglifyjs:js_packages',
		'generate_includers:js:prod',
		'cssmin:css_packages',
		'generate_includers:css:prod',
		'generateRequireConfig:prod',
		'generate_resources_params_includer:prod',
		'generate_includers:html'
	]);

	this.registerTask('build:dev', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'generate_includers:livereload',
		'hint',
		'transpile:dev',
		'generate_includers:js:dev',
		'compass:compile',
		'generate_includers:css:dev',
		'generateRequireConfig:dev',
		'generate_resources_params_includer:dev',
		'generate_includers:html'
	]);
	this.registerTask('build:dev:spec', 'Builds a distributable version of <%= cfg.name %>', [
		'clean',
		'enable_force',
		'hint',
		'generate_includers:livereload',
		'build:dev:modules',
		'generate_includers:js:dev',
		'generate_includers:css:dev',
		'generateRequireConfig:dev',
		'generate_resources_params_includer:dev',
		'generate_includers:html'
	]);
	this.registerTask('build:dev:modules', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:modules',
		'enable_force',
		'hint',
		'transpile:dev',
	]);

	this.registerTask('build:dev:js_packages', 'Builds a distributable version of <%= cfg.name %>', [
		'hint'
	]);

	this.registerTask('build:prod:modules', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:modules',
		'enable_force',
		'hint',
		'transpile:prod',
		'uglifyjs:single_modules',
		'uglifyjs:packaged_modules'
	]);

	this.registerTask('build:prod:js_packages', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:js',
		'enable_force',
		'hint',
		'uglifyjs:js_packages'
	]);

	this.registerTask('build:prod:css', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:css',
		'cssmin:css_packages'
	]);

	this.registerTask('hint', 'JSHint all files', [
		'jshint:modules',
		'jshint:js_packages'
	]);

	this.registerTask('enable_force', 'Enable force option', function(){
		grunt.config('jshint.options.force', true);
	});



	// Custom phantomjs test task

	// Custom Node test task
	this.registerTask('test', ['build', 'tests', 'mochaTest']);

	this.registerTask('docs', ['clean:docs', 'grock']);

	config.env = process.env;
	config.pkg = grunt.file.readJSON('package.json');
	config.build = grunt.file.readJSON('config/build.json');

	// Load custom tasks from NPM
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-grock');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	// Merge config into emberConfig, overwriting existing settings
	grunt.initConfig(config);
};