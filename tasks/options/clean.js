module.exports = {
	main: ['transpiled', 'dist', 'tmp'],
	modules: ['transpiled', 'tmp', 'dist/*.js', '!dist/js/*.js', '!dist/js/*.js.map'],
	js : ['dist/js'],
	css: ['dist/stylesheets']
};