module.exports = function (grunt) {
	grunt.registerTask('uglifyVendors', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			vendors = buildData.vendors,
			vendorDistDir = buildData.vendorDistDir,
			vendorSrcDir = buildData.vendorSrcDir,
			vendorFiles = {},
			processVendors = function () {
				var vendor, src;
				for (vendor in vendors) {
					eachVendor(vendor);
				}

				function eachVendor(vendor) {
					src = [];
					analyze(vendor, src);
					vendorFiles[vendorDistDir + '/' + vendor + '.js'] = src;
				}

				function analyze(ven, array) {
					if (vendors[ven]) {
						vendors[ven].forEach(function (sub) {
							if (vendors[sub]) {
								analyze(sub, array);
							} else {
								array.push(vendorSrcDir + '/' + sub + '.js');
							}
						});
					}
				}
			};

		processVendors();
		grunt.config('uglify.vendor.files', vendorFiles);
		grunt.task.run(['uglify:vendor']);
	});
};