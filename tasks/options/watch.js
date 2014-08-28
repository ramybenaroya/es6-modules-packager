var _ = require('lodash');
module.exports = function (grunt) {
	var buildData  = grunt.file.readJSON('config/build.json'),
		devWatchTargets = {
			specdev: {
				files: ['config/**/*.json'],
				tasks: ['build:dev:spec']
			},
			modulesdev: {
				files: ['<%=build.modulesSrcDir%>/**/*.js'],
				tasks: ['build:dev:modules']
			},
			jsdev: {
				files: ['<%=build.jsSrcDir%>/**/*.js'],
				tasks: ['build:dev:js_packages']	
			},
			cssdev: {
				files: ['<%=build.cssSrcDir%>/**/*.css'],
				tasks: []
			}
		},
		prodWatchTargets = {
			specprod: {
				files: ['config/**/*.json'],
				tasks: ['build:prod:spec']
			},
			modulesprod: {
				files: ['<%=build.modulesSrcDir%>/**/*.js'],
				tasks: ['build:prod:modules']
			},
			jsprod: {
				files: ['<%=build.jsSrcDir%>/**/*.js'],
				tasks: ['build:prod:js_packages']
			},
			cssprod: {
				files: ['<%=build.cssSrcDir%>/**/*.css'],
				tasks: ['build:prod:css']
			}
		},
		assignTargets = function (targets) {
			for (var target in targets) {
				grunt.config('watch.' + target + '.files', targets[target].files);
				grunt.config('watch.' + target + '.tasks', targets[target].tasks);
			}
		},
		generateTargetStubs = function (targets) {
			var stubs = {};
			for (var target in targets) {
				stubs[target] = {
					files: [],
					tasks: []
				};
			}
			return stubs;
		};
	grunt.registerTask('assign_watch:dev', 'create a script for loading all vendor scripts synchrounsly', function () {
		assignTargets(devWatchTargets);
		grunt.task.run('watch');
	});
	grunt.registerTask('assign_watch:prod', 'create a script for loading all vendor scripts synchrounsly', function () {
		assignTargets(prodWatchTargets);
		grunt.task.run('watch');
	});

	return _.extend({
			options: {
				livereload: buildData.livereload
			}
		},
		generateTargetStubs(devWatchTargets),
		generateTargetStubs(prodWatchTargets)
	);
};