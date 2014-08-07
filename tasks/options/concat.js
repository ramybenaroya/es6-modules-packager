module.exports = function (grunt) {

	var packagingData = grunt.file.readJSON('packaging.json'),
		vendors = packagingData.vendors,
		groups = packagingData.groups,
		ignored = packagingData.ignored,
		vendorFiles = {};
	vendors.forEach(function (vendor) {
		var src = [];
		vendor.files.forEach(function (file) {
			src.push('<%=pkg.vendor%>/' + file + '.js');
		});
		vendorFiles['dist/<%=pkg.vendor%>/' + vendor.name + '.js'] = src;
	});

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