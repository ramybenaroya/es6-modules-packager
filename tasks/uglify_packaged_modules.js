module.exports = function (grunt) {
	grunt.registerTask('uglifyjs:packaged_modules', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			modulesData = grunt.file.readJSON('config/modules.json'),
			modules = modulesData.modules,
			ignored = modulesData.ignored,
			modulesSrcDir = buildData.modulesSrcDir,
			modulesDistDir = buildData.modulesDistDir,
			transpiledDir = buildData.transpiledDir,
			hasBeenAnalyzed = {},
			hasBeenPushed = {},
			files = {},
			Compiler = require("grunt-es6-module-transpiler/node_modules/es6-module-transpiler/dist/es6-module-transpiler").Compiler,
			getDeps = function (module) {
				var compiler, deps, compiled, matchesArray, index,
					reg = /\/\*ignored\*\/.*?__dependency(\d+?)__\[/g,
					ignoredByComment = {};
				try {
					compiler = new Compiler(grunt.file.read(modulesSrcDir + '/' + module + '.js'), module, {
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
		modules.forEach(function (rootModule) {
			var analyze = function (module) {
				var deps, trasnpiledDeps;
				if (hasBeenAnalyzed[rootModule][module]) {
					return;
				}
				hasBeenAnalyzed[rootModule][module] = true;
				deps = getDeps(module);
				deps.forEach(analyze);
				trasnpiledDeps = deps
					.filter(function (dep) {
						return !hasBeenPushed[rootModule][dep];
					})
					.map(function (dep) {
						return transpiledDir + '/' + dep + '.js';
					});
				deps = deps.forEach(function (dep) {
					hasBeenPushed[rootModule][dep] = true;
				});

				files[modulesDistDir + '/' + rootModule + '.js'] = files[modulesDistDir + '/' + rootModule + '.js'].concat(trasnpiledDeps);
			};
			hasBeenPushed[rootModule] = {};
			hasBeenAnalyzed[rootModule] = {};
			files[modulesDistDir + '/' + rootModule + '.js'] = [];
			console.log('Resolving dependencies for ' + rootModule);
			analyze(rootModule);
			console.log('\t' + files[modulesDistDir + '/' + rootModule + '.js'].join('\n\t'));
			files[modulesDistDir + '/' + rootModule + '.js'].push(transpiledDir + '/' + rootModule + '.js');
		});

		grunt.config('uglify.packaged_modules.files', files);
		grunt.task.run(['uglify:packaged_modules']);

	});
};