module.exports = {
	dev: {
		tasks: ['watch:modulesdev', 'watch:specdev', 'compass:watch'],
		options: {
			logConcurrentOutput: true
		}
	},
	prod: {
		tasks: ['watch:modulesprod', 'watch:vendorprod', 'watch:cssprod', 'watch:specprod', 'compass:watch'],
		options: {
			logConcurrentOutput: true,
			limit: 5
		}
	}
};