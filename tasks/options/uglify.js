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
        hasBeenPushed = {},
        files = {},
        packagesFiles = {},
        vendorFiles = {},
        fs = require('fs'),
        path = require('path'),
        Compiler = require("grunt-es6-module-transpiler/node_modules/es6-module-transpiler/dist/es6-module-transpiler").Compiler,
        getDeps = function (module) {
            var compiler, deps,compiled,matchesArray, index,
                reg = /\/\*no-package\*\/.*?__dependency(\d+?)__\[/g,
                ignoredByComment = {};
            try {
                compiler = new Compiler(grunt.file.read(rootDir + '/' + module + '.js'), module, {
                    type: 'amd'
                });
            } catch (e) {
                throw "cannot compile module " + module + '.\n' + e;
            }
            compiled = compiler.toAMD.apply(compiler).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g," ");
            deps = JSON.parse(compiled.substring(compiled.indexOf('['), compiled.indexOf(']') + 1));
            while ((matchesArray = reg.exec(compiled)) !== null){
                if (matchesArray.length === 2){
                    index = parseInt(matchesArray[1]) - 1;
                    ignoredByComment[deps[index]] = true;
                }
            }

            return deps.filter(function (dep) {
                return !ignored[dep] && !ignoredByComment[dep];
            });
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
    groups.forEach(function (group) {
        var analyze = function (module) {
            var deps, trasnpiledDeps;
            if (hasBeenAnalyzed[group][module]) {
                return;
            }
            hasBeenAnalyzed[group][module] = true;
            deps = getDeps(module);
            deps.forEach(analyze);
            trasnpiledDeps = deps
            .filter(function(dep){
                return !hasBeenPushed[group][dep];
            })
            .map(function (dep) {
                return transpiledDir + '/' + dep + '.js';
            });
            deps = deps.forEach(function(dep){
                hasBeenPushed[group][dep] = true;
            });
            
            packagesFiles[modulesDistDir + '/' + group + '.js'] = packagesFiles[modulesDistDir + '/' + group + '.js'].concat(trasnpiledDeps);
        };
        hasBeenPushed[group] = {};
        hasBeenAnalyzed[group] = {};
        packagesFiles[modulesDistDir + '/' + group + '.js'] = [];
        console.log('Resolving dependencies for '+ group);
        analyze(group);
        console.log('\t' + packagesFiles[modulesDistDir + '/' + group + '.js'].join('\n\t'));
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