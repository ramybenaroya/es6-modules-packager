// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['tmp/' + file + '.amd.js'] = ['tmp/modules/' + file + '/**/*.amd.js'];
// });

// var modules = grunt.file.readJSON('modules.json');
// var files = {};
// modules.forEach(function(module){
//     var src = [];
//     modules.files.forEach(function(file){
//         src.push('tmp/modules/' + file + '.amd.js');
//     });
//     files['tmp/' + file + '.amd.js'] = src;
// });

module.exports = function (grunt) {

	var modules = grunt.file.readJSON('modules.json'),
		vendors = grunt.file.readJSON('vendors.json'),
		files = {},
		vendorFiles = {};
	modules.forEach(function (module) {
		var src = [];
		module.files.forEach(function (file) {
			src.push('tmp/root/' + file + '.amd.js');
		});
		files['dist/' + module.name + '.amd.js'] = src;
	});
	vendors.forEach(function (vendor) {
		var src = [];
		vendor.files.forEach(function (file) {
			src.push('<%=pkg.vendor%>/' + file + '.js');
		});
		vendorFiles['dist/<%=pkg.vendor%>/' + vendor.name + '.js'] = src;
	});

	return {
		options: {
			sourceMap: true
		},
		amd: {
			files: files,
		},
		vendor: {
			files: vendorFiles,
		}
	};
};