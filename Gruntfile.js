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
	this.registerTask('server', ['build:dev', 'tests', 'connect', 'watch:jsdev']);
	this.registerTask('watcher', ['build:dev', 'tests', 'concurrent:jsdev']);
	this.registerTask('server:prod', ['build:prod', 'tests', 'connect', 'watch:jsprod']);

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
		'vendors:dev'
	]);
	this.registerTask('build:dev:slim', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:slim',
		'jshint',
		'transpile:dev',
	]);
	this.registerTask('build:prod:slim', 'Builds a distributable version of <%= cfg.name %>', [
		'clean:slim',
		'jshint',
		'transpile:prod',
		'uglify:prod',
		'uglify:packages'
	]);

	grunt.registerTask('vendors:dev', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.vendorDistDir,
			srcPrefix = buildData.vendorSrcDir,
			vendor,
			output, length, i;
		for (vendor in buildData.vendors) {
			output = [];
			appendScriptPrefix(output);
			length = buildData.vendors[vendor].length;
			for (i = 0; i < length - 1; i++) {
				output.push('\t\t\t"' + srcPrefix + '/' + buildData.vendors[vendor][i] + '.js",');
			}
			output.push('\t\t\t"' + srcPrefix + '/' + buildData.vendors[vendor][i] + '.js"');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + vendor + '.js', grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output){
			output.push('(function(globals) {');
			output.push('\tvar i, length,');
			output.push('\t\tsrcs = [');
		}

		function appendScriptSuffix(output){
			output.push('\t\t];');
			output.push('\tlength = srcs.length;');
			output.push('\tfor(i = 0; i < length; i++){');
			output.push('\t\tdocument.write(\'<script type="text/javascript" src="\' + srcs[i] + \'"><\/script>\');');
			output.push('\t}');
			output.push('})(window);');
		}

	});

	// Custom phantomjs test task

	// Custom Node test task
	this.registerTask('test', ['build', 'tests', 'mochaTest']);

	this.registerTask('docs', ['groc']);

	config.env = process.env;
	config.pkg = grunt.file.readJSON('package.json');
	config.build = grunt.file.readJSON('build.json');

	// Load custom tasks from NPM
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-groc');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-compass');


	// Merge config into emberConfig, overwriting existing settings
	grunt.initConfig(config);
};