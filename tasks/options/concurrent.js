module.exports = {
	css: {
		tasks: ['compass:dev', 'watch:css'],
		options: {
			logConcurrentOutput: true
		}
	},
	jsdev: {
		tasks: ['watch:jsdev'],
		options: {
			logConcurrentOutput: true
		}
	},
	jsprod: {
		tasks: ['watch:jsprod'],
		options: {
			logConcurrentOutput: true
		}
	}
};