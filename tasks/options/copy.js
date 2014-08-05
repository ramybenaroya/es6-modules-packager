module.exports = {
	main: {
		files: [{
			expand: true,
			src: ['tmp/*.map'],
			dest: 'dist/',
			filter: 'isFile',
			flatten: true
		}]
	}
};