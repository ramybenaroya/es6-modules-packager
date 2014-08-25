module.exports = {
	main: ['transpiled', 'dist', 'tmp'],
	modules: ['transpiled', 'tmp', 'dist/*.js', '!dist/vendor/*.js', '!dist/vendor/*.js.map'],
	vendor : ['dist/vendor'],
	css: ['dist/stylesheets']
};