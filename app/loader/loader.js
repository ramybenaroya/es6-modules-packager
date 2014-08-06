(function(globals){
	debugger;
	var require, define;
	if (globals.require){
	  globals.requirejs = globals.require;
	  globals.definejs = globals.define;
	}

	(function() {
	  var registry = {}, seen = {};

	  define = function(name, deps, callback) {
	    registry[name] = { deps: deps, callback: callback };
	  };

	  require = function(name) {
	    var args,
	        $deferred = $.Deferred(),
	        $promise = $deferred.promise();
	    if (seen[name]) { 
	    	$deferred.resolve(seen[name])
	    	return $promise; 
	    }
	    if (!registry[name]) {
	      if (requirejs){
	        args = Array.prototype.slice.call(arguments, 0);
	        requirejs.call(requirejs, [name + '.amd'], function(){
	          require(name).done(function(result){
	            $deferred.resolve(result);
	          });
	        });
	        return $promise;
	      } else {
	        throw new Error("Could not find module " + name);
	        $deffered.reject();
	        return $promise;
	      }
	    }
	    seen[name] = {};
	    var mod = registry[name],
	        deps = mod.deps,
	        callback = mod.callback,
	        reified = [],
	        exports,
	        $loopDeffered = $.Deferred(),
	        count = 0,
	        self = this;
	    for (var i=0, l=deps.length; i<l; i++) {
	      if (deps[i] === 'exports') {
	      	exports = {};
	        reified[i] = exports;
	        count++;
	        if (count === l){
	          $loopDeffered.resolve(reified);
	        }
	      } else {
	      	(function(i){
	      		require(resolve(deps[i])).done(function(toPush){
	      		  reified[i] = toPush;
	      		  count++;
	      		  if (count === l){
	      		    $loopDeffered.resolve(reified);
	      		  }
	      		}).fail(function(){
	      		  $loopDeffered.reject();
	      		})
	      	})(i);
	      }
	    }

	    if (l == 0){
	    	$loopDeffered.resolve(reified);
	    }

	    $loopDeffered.promise().done(function(reified){
	      var value = callback.apply(self, reified);
	      seen[name] = exports || value;
	      $deferred.resolve(seen[name]);
	    }).fail(function(){
	      $deferred.reject();
	    });
	    return $promise;

	    function resolve(child) {
	      if (child.charAt(0) !== '.') { return child; }
	      var parts = child.split("/");
	      var parentBase = name.split("/").slice(0, -1);

	      for (var i=0, l=parts.length; i<l; i++) {
	        var part = parts[i];

	        if (part === '..') { parentBase.pop(); }
	        else if (part === '.') { continue; }
	        else { parentBase.push(part); }
	      }

	      return parentBase.join("/");
	    }
	  };

	  require.entries = registry;
	})();

	globals.require = require;
	globals.define = define;
})(this);