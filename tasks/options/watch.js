module.exports = {
	specdev: {
		files: ['config/**/*.json'],
		tasks: ['build:dev:spec']
	},
	modulesdev: {
		files: ['<%=build.modulesSrcDir%>/**/*.js'],
		tasks: ['build:dev:modules']
	},
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
};