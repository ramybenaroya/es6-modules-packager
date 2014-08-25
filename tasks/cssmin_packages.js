module.exports = function (grunt) {
	grunt.registerTask('cssminPackages', 'Create a single css file for each package using @import', function () {
		var buildData = grunt.file.readJSON('build.json'),
			stylesheets = buildData.stylesheets,
			cssDistDir = buildData.cssDistDir,
			cssSrcDir = buildData.cssSrcDir,
			packageFiles = {},
			processPackages = function () {
				var package, src;
				for (package in stylesheets) {
					eachPackage(package);
				}

				function eachPackage(package) {
					src = [];
					analyze(package, src);
					packageFiles[cssDistDir + '/' + package + '.css'] = src;
				}

				function analyze(css, array) {
					if (stylesheets[css]) {
						stylesheets[css].forEach(function (sub) {
							if (stylesheets[sub]) {
								analyze(sub, array);
							} else {
								array.push(cssSrcDir + '/' + sub + '.css');
							}
						});
					}
				}
			};

		processPackages();
		grunt.config('cssmin.packages.files', packageFiles);
		grunt.task.run(['cssmin:packages']);
	});
};