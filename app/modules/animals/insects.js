import {containerCreator} from 'utils/util-bundle';
import beetle from 'animals/insects/beetle';
import mantis from 'animals/insects/mantis';
import ant from 'animals/insects/ant';
import consoleWriter from 'utils/console';

consoleWriter('Insects were loaded');
export
default {
	init: function () {
		var elements = containerCreator('Insects');
		elements.wrapper.one('click', function () {
			beetle(elements.container);
			mantis(elements.container);
			ant(elements.container);
		});
		
	}
};