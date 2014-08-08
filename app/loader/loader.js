(function (globals) {

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}

	function foreach(arr, handler) {
		if (isArray(arr)) {
			for (var i = 0; i < arr.length; i++) {
				handler(arr[i]);
			}
		} else
			handler(arr);
	}

	function D(fn) {
		var status = 'pending',
			doneFuncs = [],
			failFuncs = [],
			progressFuncs = [],
			resultArgs = null,

			promise = {
				done: function () {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'resolved') {
									arr[j].apply(this, resultArgs);
								}

								doneFuncs.push(arr[j]);
							}
						} else {
							// immediately call the function if the deferred has been resolved
							if (status === 'resolved') {
								arguments[i].apply(this, resultArgs);
							}

							doneFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				fail: function () {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'rejected') {
									arr[j].apply(this, resultArgs);
								}

								failFuncs.push(arr[j]);
							}
						} else {
							// immediately call the function if the deferred has been resolved
							if (status === 'rejected') {
								arguments[i].apply(this, resultArgs);
							}

							failFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				always: function () {
					return this.done.apply(this, arguments).fail.apply(this, arguments);
				},

				progress: function () {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'pending') {
									progressFuncs.push(arr[j]);
								}
							}
						} else {
							// immediately call the function if the deferred has been resolved
							if (status === 'pending') {
								progressFuncs.push(arguments[i]);
							}
						}
					}

					return this;
				},

				then: function () {
					// fail callbacks
					if (arguments.length > 1 && arguments[1]) {
						this.fail(arguments[1]);
					}

					// done callbacks
					if (arguments.length > 0 && arguments[0]) {
						this.done(arguments[0]);
					}

					// notify callbacks
					if (arguments.length > 2 && arguments[2]) {
						this.progress(arguments[2]);
					}
				},

				promise: function (obj) {
					if (obj === null) {
						return promise;
					} else {
						for (var i in promise) {
							obj[i] = promise[i];
						}
						return obj;
					}
				},

				state: function () {
					return status;
				},

				debug: function () {
					globals.console.log('[debug]', doneFuncs, failFuncs, status);
				},

				isRejected: function () {
					return status === 'rejected';
				},

				isResolved: function () {
					return status === 'resolved';
				},
				/*jshint unused:true */
				pipe: function (done, fail, progress) {
					return D(function (def) {
						foreach(done, function (func) {
							// filter function
							if (typeof func === 'function') {
								deferred.done(function () {
									var returnval = func.apply(this, arguments);
									// if a new deferred/promise is returned, its state is passed to the current deferred/promise
									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									} else { // if new return val is passed, it is passed to the piped done
										def.resolve(returnval);
									}
								});
							} else {
								deferred.done(def.resolve);
							}
						});

						foreach(fail, function (func) {
							if (typeof func === 'function') {
								deferred.fail(function () {
									var returnval = func.apply(this, arguments);

									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									} else {
										def.reject(returnval);
									}
								});
							} else {
								deferred.fail(def.reject);
							}
						});
					}).promise();
				}
			},

			deferred = {
				resolveWith: function (context) {
					if (status === 'pending') {
						status = 'resolved';
						var args = (arguments.length > 1) ? arguments[1] : [];
						resultArgs = args;
						for (var i = 0; i < doneFuncs.length; i++) {
							doneFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				rejectWith: function (context) {
					if (status === 'pending') {
						status = 'rejected';
						var args = (arguments.length > 1) ? arguments[1] : [];
						resultArgs = args;
						for (var i = 0; i < failFuncs.length; i++) {
							failFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				notifyWith: function (context) {
					if (status === 'pending') {
						var args = (arguments.length > 1) ? arguments[1] : [];
						resultArgs = args;
						for (var i = 0; i < progressFuncs.length; i++) {
							progressFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				resolve: function () {
					return this.resolveWith(this, arguments);
				},

				reject: function () {
					return this.rejectWith(this, arguments);
				},

				notify: function () {
					return this.notifyWith(this, arguments);
				}
			};

		var obj = promise.promise(deferred);

		if (fn) {
			fn.apply(obj, [obj]);
		}

		return obj;
	}

	D.when = function () {
		if (arguments.length < 2) {
			var obj = arguments.length ? arguments[0] : undefined;
			if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
				return obj.promise();
			} else {
				return D().resolve(obj).promise();
			}
		} else {
			return (function (args) {
				var df = D(),
					size = args.length,
					done = 0,
					rp = new Array(size), // resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved
					Deferred = globals.Deffered;

				for (var i = 0; i < args.length; i++) {
					loop(i);
				}

				return df.promise();

				function loop(j) {
					var obj = null;

					if (args[j].done) {
						args[j].done(function () {
							rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
							if (++done === size) {
								df.resolve.apply(df, rp);
							}
						})
							.fail(function () {
								df.reject(arguments);
							});
					} else {
						obj = args[j];
						args[j] = new Deferred();

						args[j].done(function () {
							rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
							if (++done === size) {
								df.resolve.apply(df, rp);
							}
						})
							.fail(function () {
								df.reject(arguments);
							}).resolve(obj);
					}
				}
			})(arguments);
		}
	};

	globals.Deferred = D;
})(window);



(function (globals) {

	var define, require, requirejs, definejs,
		requirejsFallback = false;
	if (globals.require && globals.define && globals.define.amd) {
		requirejs = globals.require;
		definejs = globals.define;
		requirejsFallback = true;
	}

	(function () {
		var registry = {},
			seen = {},
			locks = {};

		define = function (name, deps, callback) {
			registry[name] = {
				deps: deps,
				callback: callback
			};
		};

		require = function (name, onResolve) {
			var args, $deferred, $promise;
			if (requirejsFallback && typeof name !== 'string') {
				args = Array.prototype.slice.call(arguments, 0);
				return requirejs.apply(this, args);
			}
			$deferred = new globals.Deferred();
			$promise = $deferred.promise();
			$promise.done(function (resolved) {
				if (typeof onResolve === 'function') {
					onResolve.call(resolved, [resolved]);
				}
			});
			if (seen[name]) {
				$deferred.resolve(seen[name]);
				return $promise;
			}
			if (!registry[name]) {
				if (requirejsFallback) {
					args = Array.prototype.slice.call(arguments, 0);
					if (locks[name]) {
						locks[name].promise().done(function(resolved) {
							$deferred.resolve(resolved);
						});
					} else {
						requireForReal();
					}
					return $promise;
				} else {
					$deferred.reject();
					throw new Error('Could not find module ' + name);
				}
			}
			seen[name] = {};
			resolveDeps();
			return $promise;

			function requireForReal() {
				locks[name] = new globals.Deferred();
				requirejs.call(this, [name], function () {
					if (registry[name]) {
						require(name).done(function (resolved) {
							$deferred.resolve(resolved);
						});
					}
				});
			}

			function resolveDeps() {
				var mod = registry[name],
					deps = mod.deps,
					callback = mod.callback,
					reified = [],
					exports,
					$loopDeferred = new globals.Deferred(),
					count = 0,
					self = this,
					eachDep = function (i) {
						require(resolve(deps[i])).done(function (toPush) {
							reified[i] = toPush;
							count++;
							if (count === l) {
								$loopDeferred.resolve(reified);
							}
						}).fail(function () {
							$loopDeferred.reject();
						});
					};
				for (var i = 0, l = deps.length; i < l; i++) {
					if (deps[i] === 'exports') {
						exports = {};
						reified[i] = exports;
						count++;
						if (count === l) {
							$loopDeferred.resolve(reified);
						}
					} else {
						eachDep(i);
					}
				}

				if (l === 0) {
					$loopDeferred.resolve(reified);
				}

				$loopDeferred.promise().done(function (reified) {
					var value = callback.apply(self, reified),
						nameLock;
					seen[name] = exports || value;
					if (registry[name].deps[registry[name].deps.length - 1] !== 'exports') {
						seen[name]['default'] = seen[name];
					}
					$deferred.resolve(seen[name]);
					if (locks[name]) {
						nameLock = locks[name];
						delete locks[name];
						nameLock.resolve(seen[name]);
					}
				}).fail(function () {
					$deferred.reject();
				});
			}

			function resolve(child) {
				if (child.charAt(0) !== '.') {
					return child;
				}
				var parts = child.split('/');
				var parentBase = name.split('/').slice(0, -1);

				for (var i = 0, l = parts.length; i < l; i++) {
					var part = parts[i];

					if (part === '..') {
						parentBase.pop();
					} else if (part === '.') {
						continue;
					} else {
						parentBase.push(part);
					}
				}

				return parentBase.join('/');
			}
		};
		require.entries = require._eak_seen = registry;
		require.clear = function () {
			require.entries = require._eak_seen = registry = {};
			seen = {};
		};
	})();

	globals.require = require;
	globals.requirejs = require;
	globals.define = define;

	if (requirejsFallback) {
		extend(require, requirejs);
		extend(define, definejs);
	}

	function extend(a, b) {
		for (var key in b)
			if (b.hasOwnProperty(key))
				a[key] = b[key];
		return a;
	}

})(this);