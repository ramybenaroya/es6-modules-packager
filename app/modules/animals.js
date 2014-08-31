/**
Animals ES6 Module
-------------------
A module responsible for the initialization of Mmmmamls, insects and reptiles.
*/

import mammals from 'animals/mammals';
/*ignored*/
import reptiles from 'animals/reptiles';
import consoleWriter from 'utils/console';

consoleWriter('Animals were loaded');
export
default {

	/**
	Initalize `mammals` and `reptiles` synchronously.
	Initialize `insects` module with require.
	require can be used in several ways:
	
	- Async Promise
	```javascript
	 	require("path/to/module").then(function(resolvedModule){
	 		var something = resolvedModule.doSomething();
	 	});
	```
	- Async Callback
	```javascript
		require("path/to/module").then(function(resolvedModule){
		 		var something = resolvedModule.doSomething();
		});
	```
	- Async Multiple
	```javascript
		require("path/to/module1", "path/to/module2").then(function(resolvedModule1, resolvedModule2){
			var something1 = resolvedModule1.doSomething();
			var something2 = resolvedModule2.doSomething();
		});
	```
	- Sync
	```javascript
		var something = requireSync("path/to/module")[property].doSomthing();
	```
	*/
	init: function () {
		mammals.init();
		require('animals/insects', function (insects) {
			insects['default'].init();
		});
		reptiles.init();
	}
};