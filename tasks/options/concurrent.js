module.exports = {
	dev: {
		tasks: ['assign_watch:dev', 'compass:watch'],
		options: {
			logConcurrentOutput: true,
			limit: 6
		}
	},
	prod: {
		tasks: ['assign_watch:prod','compass:watch'],
		options: {
			logConcurrentOutput: true,
			limit: 6
		}
	}
};