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
		processVendors = function(){
			var vendor, src;
			for (vendor in vendors){
				src = [];
				analyze(vendor);
				vendorFiles[vendorDistDir + '/' + vendor + '.js'] = src;
			}
			function analyze(ven){
				if (vendors[ven]){
					vendors[ven].forEach(function (sub) {
						if (vendors[sub]){
							analyze(sub);
						} else {
							src.push(vendorSrcDir + '/' + sub + '.js');
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