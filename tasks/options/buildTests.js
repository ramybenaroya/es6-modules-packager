module.exports = {
	dist: {
		src: [
			'node_modules/grunt-microroot/assets/loader.js',
			'transpiled/tests.amd.js',
			'transpiled/<%= pkg.name %>/**/*.amd.js',
			'transpiled/<%= pkg.name %>.amd.js'
		],
		dest: 'transpiled/tests.js'
	}
};