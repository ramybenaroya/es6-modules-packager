function nameFor(path) {
	var result, match;
	if (match = path.match(/^(?:root|test|test\/tests)\/(.*?)(?:\.js)?$/)) {
		result = match[1];
	} else {
		result = path;
	}
	return path;
}

module.exports = {
	prod: {
		moduleName: nameFor,
		type: 'amd',
		files: [{
			expand: true,
			cwd: '<%=pkg.root%>/',
			src: ['**/*.js'],
			dest: '<%=build.transpiledDir%>',
			ext: '.js'
		}]
	},
	dev: {
		moduleName: nameFor,
		type: 'amd',
		files: [{
			expand: true,
			cwd: '<%=pkg.root%>/',
			src: ['**/*.js'],
			dest: '<%=build.modulesDistDir%>',
			ext: '.js'
		}]
	},

	testsAmd: {
		moduleName: nameFor,
		type: 'amd',
		src: ['test/test_helpers.js', 'test/tests.js', 'test/tests/**/*_test.js'],
		dest: 'transpiled/tests.amd.js'
	}
};