module.exports = {
	main: ['transpiled', 'dist', 'tmp'],
	modules: ['transpiled', 'tmp', 'dist/root/*.js'],
	js : ['dist/js'],
	css: ['dist/stylesheets'],
	docs: ['docs']
};