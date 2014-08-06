module.exports = {
	server: {
		files: ['<%=pkg.root%>/**/*.js', 'vendor/**/*.js', 'test/**/*.js'],
		tasks: ['build', 'tests']
	}
};