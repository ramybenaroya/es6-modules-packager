// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.amd.min.js'] = ['dist/' + file + '.amd.js'];
// });

module.exports = function (grunt) {
    var modules = grunt.file.readJSON('modules.json'),
        vendors = grunt.file.readJSON('vendors.json'),
        files = {},
        vendorFiles = {};
    modules.forEach(function (module) {
        var src = [];
        files['dist/' + module.name + '.amd.min.js'] = ['dist/' + module.name + '.amd.js'];
    });
    vendors.forEach(function (vendor) {
        var src = [];
        vendorFiles['dist/vendor/' + vendor.name + '.min.js'] = ['dist/vendor/' + vendor.name + '.js'];
    });
    return {
        amd: {
            options: {
                mangle: true,
                sourceMap: true
                
            },
            files: files
        },
        vendor : {
            options: {
                mangle: true,
                sourceMap: true
            },
            files : vendorFiles  
        }
    };
}