// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.min.js'] = ['dist/' + file + '.js'];
// });

module.exports = function (grunt) {
    var buildData = grunt.file.readJSON('build.json'),
        vendors = buildData.vendors,
        groups = buildData.groups,
        ignored = buildData.ignored,
        rootDir = buildData.rootSrcDir,
        vendorDistDir = buildData.vendorDistDir,
        vendorSrcDir = buildData.vendorSrcDir,
        transpiledDir = buildData.transpiledDir,
        modulesDistDir = buildData.modulesDistDir,
        hasBeenAnalyzed = {},
        files = {},
        packagesFiles = {},
        vendorFiles = {},
        fs = require('fs'),
        path = require('path'),
        Compiler = require("grunt-es6-module-transpiler/node_modules/es6-module-transpiler/dist/es6-module-transpiler").Compiler,
        getDeps = function (module) {
            var compiler = new Compiler(grunt.file.read(rootDir + '/' + module + '.js'), module, {
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
        },
        processVendors = function () {
            var vendor, src;
            for (vendor in vendors) {
                src = [];
                analyze(vendor);
                vendorFiles[vendorDistDir + '/' + vendor + '.js'] = src;
            }

            function analyze(ven) {
                if (vendors[ven]) {
                    vendors[ven].forEach(function (sub) {
                        if (vendors[sub]) {
                            analyze(sub);
                        } else {
                            src.push(vendorSrcDir + '/' + sub + '.js');
                        }
                    });
                }
            }
        };

    groups.forEach(function (group) {
        var analyze = function (module) {
            var deps, trasnpiledDeps;
            if (hasBeenAnalyzed[group][module]) {
                return;
            }
            hasBeenAnalyzed[group][module] = true;
            deps = getDeps(module);
            deps.forEach(analyze);
            trasnpiledDeps = deps.map(function (dep) {
                return transpiledDir + '/' + dep + '.js';
            });
            packagesFiles[modulesDistDir + '/' + group + '.js'] = trasnpiledDeps;
        };
        hasBeenAnalyzed[group] = {};
        analyze(group);
        packagesFiles[modulesDistDir + '/' + group + '.js'].push(transpiledDir + '/' + group + '.js');
    });


    var allFiles = getFiles(rootDir).map(function (file) {
        return file.replace(rootDir + '/', '').replace('.js', '');
    });
    allFiles.forEach(function (file) {
        files[modulesDistDir + '/' + file + '.js'] = [transpiledDir + '/' + file + '.js'];
    });

    processVendors();

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