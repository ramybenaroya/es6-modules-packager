module.exports = function (grunt) {
	grunt.registerTask('uglifyJsPackages', 'Minify JS Packages', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			jsPackages = grunt.file.readJSON('config/js.packages.json'),
			jsDistDir = buildData.jsDistDir,
			jsSrcDir = buildData.jsSrcDir,
			files = {},
			processJsPackages = function () {
				var jsPackage, src;
				for (jsPackage in jsPackages) {
					eachJsPackage(jsPackage);
				}

				function eachJsPackage(jsPackage) {
					src = [];
					analyze(jsPackage, src);
					files[jsDistDir + '/' + jsPackage + '.js'] = src;
				}

				function analyze(ven, array) {
					if (jsPackages[ven]) {
						jsPackages[ven].forEach(function (sub) {
							if (jsPackages[sub]) {
								analyze(sub, array);
							} else {
								array.push(jsSrcDir + '/' + sub + '.js');
							}
						});
					}
				}
			};

		processJsPackages();
		grunt.config('uglify.js_packages.files', files);
		grunt.task.run(['uglify:js_packages']);
	});
};