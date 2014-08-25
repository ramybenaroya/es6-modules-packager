module.exports = function (grunt) {
	grunt.registerTask('uglifyModules', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			rootDir = buildData.rootSrcDir,
			transpiledDir = buildData.transpiledDir,
			modulesDistDir = buildData.modulesDistDir,
			files = {},
			fs = require('fs'),
			path = require('path'),
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

		var allFiles = getFiles(rootDir).map(function (file) {
			return file.replace(rootDir + '/', '').replace('.js', '');
		});
		allFiles.forEach(function (file) {
			files[modulesDistDir + '/' + file + '.js'] = [transpiledDir + '/' + file + '.js'];
		});
		grunt.config('uglify.modules.files', files);
		grunt.task.run(['uglify:modules']);

	});
};