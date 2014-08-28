module.exports = function(grunt){
	var ignored  = grunt.file.read('config/jshint/.jshintignore').split('\n').map(function(item){
		return '<%=build.jsSrcDir%>/' + item;
	})
	return {
		options : {
			ignores : ignored
		},
		modules : {
			options: {
				'jshintrc': 'config/jshint/modules.jshintrc'
			},
			files: {
				src: ['<%=build.modulesSrcDir%>/**/*.js']
			}	
		},
		js_packages : {
			options: {
				'jshintrc': 'config/jshint/js_packages.jshintrc'
			},
			files: {
				src: ['<%=build.jsSrcDir%>/**/*.js'],
			}
		}	
	}
};