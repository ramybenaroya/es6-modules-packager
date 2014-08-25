module.exports = {
	specdev: {
		files: ['build.json'],
		tasks: ['build:dev:spec']
	},
	modulesdev: {
		files: ['<%=build.modulesSrcDir%>/**/*.js'],
		tasks: ['build:dev:modules']
	},
	specprod: {
		files: ['build.json'],
		tasks: ['build:prod:spec']
	},
	modulesprod: {
		files: ['<%=build.modulesSrcDir%>/**/*.js'],
		tasks: ['build:prod:modules']
	},
	vendorprod: {
		files: ['<%=build.vendorSrcDir%>/**/*.js'],
		tasks: ['build:prod:vendor']
	},
	cssprod: {
		files: ['<%=build.cssSrcDir%>/**/*.css'],
		tasks: ['build:prod:css']
	}
};