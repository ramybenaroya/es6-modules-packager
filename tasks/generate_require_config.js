module.exports = function (grunt) {
	var moment = require('moment'),
		beautify = require('js-beautify').js_beautify,
		generateRequireConfig = function (isDev) {
			var buildData = grunt.file.readJSON('config/build.json'),
				jsPackages = grunt.file.readJSON('config/js.packages.json'),
				requireConfig = grunt.file.readJSON('config/require.config.json'),
				jsPackage,
				output = [];
			requireConfig.paths = requireConfig.paths || {};
			requireConfig.baseUrl = '/' + buildData.modulesDistDir;
			for (jsPackage in jsPackages) {
				if (jsPackages[jsPackage].length === 1) {
					requireConfig.paths[jsPackage] = '/' + (isDev ? buildData.jsSrcDir : buildData.jsDistDir) + '/' + jsPackages[jsPackage][0];
				}
			}
			if (isDev) {
				output.push('/*');
				output.push('This is an auto-generated file for development environment');
				output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
				output.push('*/');
			}
			output.push('(function(){');
			output.push('require.config(');
			output.push(JSON.stringify(requireConfig));
			output.push(')');
			output.push('})();');
			grunt.file.write(buildData.requireConfigDistDir + '/require.config.js', beautify(output.join('\n')));
		}
	grunt.registerTask('generateRequireConfig:dev', 'Generate require.config.js for development environment', function () {
		generateRequireConfig(true);
	});

	grunt.registerTask('generateRequireConfig:prod', 'Generate require.config.js for production environment', function () {
		generateRequireConfig(false);
	});
};