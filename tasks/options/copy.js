module.exports = {
	main: {
		files: [{
			expand: true,
			src: ['transpiled/**/.js'],
			dest: 'dist/',
			filter: 'isFile',
			flatten: true
		}]
	}
};