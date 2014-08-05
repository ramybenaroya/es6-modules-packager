// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.amd.min.js'] = ['dist/' + file + '.amd.js'];
// });

module.exports = function (grunt) {
    var modules = grunt.file.readJSON('modules.json'),
        files = {};
    modules.forEach(function (module) {
        var src = [];
        files['dist/' + module.name + '.amd.min.js'] = ['dist/' + module.name + '.amd.js'];
    });
    return {
        browser: {
            options: {
                mangle: true
            },
            files: {
                'dist/modules-<%= pkg.version %>.min.js': ['dist/modules-<%= pkg.version %>.js'],
            }
        },
        amd: {
            options: {
                mangle: true,
                sourceMap: true
                
            },
            files: files
        },
        browserNoVersion: {
            options: {
                mangle: true
            },
            files: {
                'dist/modules.min.js': ['dist/modules.js'],
            }
        }
    };
}