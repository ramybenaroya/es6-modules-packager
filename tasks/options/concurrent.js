module.exports = {
	css: {
		tasks: ['compass:dev', 'watch:css'],
		options: {
			logConcurrentOutput: true
		}
	},
	js: {
		tasks: ['watch:js'],
		options: {
			logConcurrentOutput: true
		}
	}
};