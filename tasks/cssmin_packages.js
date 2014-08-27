module.exports = function (grunt) {
	grunt.registerTask('minifyCssPackages', 'Minify CSS packages', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			cssPackages = grunt.file.readJSON('config/css.packages.json'),
			cssDistDir = buildData.cssDistDir,
			cssSrcDir = buildData.cssSrcDir,
			files = {},
			processCssPackages = function () {
				var cssPackage, src;
				for (cssPackage in cssPackages) {
					eachPackage(cssPackage);
				}

				function eachPackage(cssPackage) {
					src = [];
					analyze(cssPackage, src);
					files[cssDistDir + '/' + cssPackage + '.css'] = src;
				}

				function analyze(css, array) {
					if (cssPackages[css]) {
						cssPackages[css].forEach(function (sub) {
							if (cssPackages[sub]) {
								analyze(sub, array);
							} else {
								array.push(cssSrcDir + '/' + sub + '.css');
							}
						});
					}
				}
			};

		processCssPackages();
		grunt.config('cssmin.packages.files', files);
		grunt.task.run(['cssmin:packages']);
	});
};