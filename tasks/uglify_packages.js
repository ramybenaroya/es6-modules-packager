module.exports = function (grunt) {
	grunt.registerTask('uglifyPackages', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			groups = buildData.groups,
			ignored = buildData.ignored,
			rootDir = buildData.rootSrcDir,
			transpiledDir = buildData.transpiledDir,
			modulesDistDir = buildData.modulesDistDir,
			hasBeenAnalyzed = {},
			hasBeenPushed = {},
			packagesFiles = {},
			Compiler = require("grunt-es6-module-transpiler/node_modules/es6-module-transpiler/dist/es6-module-transpiler").Compiler,
			getDeps = function (module) {
				var compiler, deps, compiled, matchesArray, index,
					reg = /\/\*no-package\*\/.*?__dependency(\d+?)__\[/g,
					ignoredByComment = {};
				try {
					compiler = new Compiler(grunt.file.read(rootDir + '/' + module + '.js'), module, {
						type: 'amd'
					});
				} catch (e) {
					throw "cannot compile module " + module + '.\n' + e;
				}
				compiled = compiler.toAMD.apply(compiler).replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ");
				deps = JSON.parse(compiled.substring(compiled.indexOf('['), compiled.indexOf(']') + 1));
				while ((matchesArray = reg.exec(compiled)) !== null) {
					if (matchesArray.length === 2) {
						index = parseInt(matchesArray[1]) - 1;
						ignoredByComment[deps[index]] = true;
					}
				}

				return deps.filter(function (dep) {
					return !ignored[dep] && !ignoredByComment[dep];
				});
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
					.filter(function (dep) {
						return !hasBeenPushed[group][dep];
					})
					.map(function (dep) {
						return transpiledDir + '/' + dep + '.js';
					});
				deps = deps.forEach(function (dep) {
					hasBeenPushed[group][dep] = true;
				});

				packagesFiles[modulesDistDir + '/' + group + '.js'] = packagesFiles[modulesDistDir + '/' + group + '.js'].concat(trasnpiledDeps);
			};
			hasBeenPushed[group] = {};
			hasBeenAnalyzed[group] = {};
			packagesFiles[modulesDistDir + '/' + group + '.js'] = [];
			console.log('Resolving dependencies for ' + group);
			analyze(group);
			console.log('\t' + packagesFiles[modulesDistDir + '/' + group + '.js'].join('\n\t'));
			packagesFiles[modulesDistDir + '/' + group + '.js'].push(transpiledDir + '/' + group + '.js');
		});

		grunt.config('uglify.packages.files', packagesFiles);
		grunt.task.run(['uglify:packages']);

	});
};