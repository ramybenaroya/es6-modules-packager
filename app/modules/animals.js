import mammals from 'animals/mammals';
/*ignored*/
import reptiles from 'animals/reptiles';
import consoleWriter from 'utils/console';

consoleWriter('Animals were loaded');
export
default {
	init: function () {

		mammals.init();
		require('animals/insects', function (insects) {
			insects['default'].init();
		});
		reptiles.init();
	}
};