module.exports = {
	js: {
		files: ['<%=pkg.root%>/**/*.js', 'vendor/**/*.js', 'test/**/*.js'],
		tasks: ['build:dev:slim', 'tests']
	},
	css: {
		files: ['<%=build.cssSrcDir%>/**/*.css'],
		tasks: ['build:css:slim']
	}
};