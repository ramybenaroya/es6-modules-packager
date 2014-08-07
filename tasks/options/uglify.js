// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.min.js'] = ['dist/' + file + '.js'];
// });

module.exports = function (grunt) {
    var packagingData = grunt.file.readJSON('packaging.json'),
        vendors = packagingData.vendors,
        groups = packagingData.groups,
        ignored = packagingData.groups,
        files = {},
        packagesFiles = {},
        vendorFiles = {},
        fs = require('fs'),
        path = require('path');
    var Compiler = require("grunt-es6-module-transpiler/node_modules/es6-module-transpiler/dist/es6-module-transpiler").Compiler,
        getDeps = function (file) {
            var compiler = new Compiler(grunt.file.read('app/root/' + file + '.js'), file, {
                    type: 'amd'
                }),
                compiled = compiler.toAMD.apply(compiler),
                deps = JSON.parse(compiled.substring(compiled.indexOf('['), compiled.indexOf(']') + 1)).filter(function (dep) {
                    return !ignored[dep];
                });
            return deps;
        },
        getFiles = function (dir, files_) {
            files_ = files_ || [];
            if (typeof files_ === 'undefined') files_ = [];
            var files = fs.readdirSync(dir);
            for (var i in files) {
                if (!files.hasOwnProperty(i)) continue;
                var name = dir + '/' + files[i];
                if (fs.statSync(name).isDirectory()) {
                    getFiles(name, files_);
                } else {
                    files_.push(name);
                }
            }
            return files_;
        };

    groups.forEach(function (group) {
        var deps = getDeps(group)
            .map(function (file) {
                return 'transpiled/' + file + '.js';
            });
        deps.push('transpiled/' + group + '.js');
        packagesFiles['dist/' + group + '.js'] = deps;
    });


    var allFiles = getFiles('app/root').map(function (file) {
        return file.replace('app/root/', '').replace('.js', '');
    });
    allFiles.forEach(function (file) {
        files['dist/' + file + '.js'] = ['transpiled/' + file + '.js'];
    });
    vendors.forEach(function (vendor) {
        var src = [];
        vendorFiles['dist/vendor/' + vendor.name + '.js'] = ['dist/vendor/' + vendor.name + '.js'];
    });
    return {
        prod: {
            options: {
                mangle: true,
                sourceMap: true

            },
            files: files
        },
        packages: {
            options: {
                mangle: true,
                sourceMap: true
            },
            files: packagesFiles
        },
        vendor: {
            options: {
                mangle: true,
                sourceMap: true
            },
            files: vendorFiles
        }
    };
};