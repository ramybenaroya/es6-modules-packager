module.exports = function (grunt) {

	var buildData = grunt.file.readJSON('build.json'),
		vendors = buildData.vendors,
		groups = buildData.groups,
		ignored = buildData.ignored,
		rootSrcDir = buildData.rootSrcDir,
		vendorSrcDir = buildData.vendorSrcDir,
		modulesDistDir = buildData.modulesDistDir,
		vendorDistDir = buildData.vendorDistDir,
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

	return {
		options: {
			sourceMap: true,
			separator: ';\n'
		},
		vendor: {
			files: vendorFiles,
		}
	};
};