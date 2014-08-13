module.exports = {
	jsdev: {
		files: ['<%=pkg.root%>/**/*.js'],
		tasks: ['build:dev:slim', 'tests']
	},
	jsprod: {
		files: ['<%=pkg.root%>/**/*.js'],
		tasks: ['build:prod:slim', 'tests']
	},
	css: {
		files: ['<%=build.cssSrcDir%>/**/*.css'],
		tasks: ['build:css:slim']
	}
};