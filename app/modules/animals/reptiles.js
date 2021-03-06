import {containerCreator} from 'utils/util-bundle';
import lizard from 'animals/reptiles/lizard';
import crocodile from 'animals/reptiles/crocodile';
import camelion from 'animals/reptiles/camelion';
import consoleWriter from 'utils/console';

consoleWriter('Reptiles were loaded');
export
default {
	init: function () {
		var elements = containerCreator('Reptiles');
		elements.wrapper.one('click', function () {
			lizard(elements.container);
			crocodile(elements.container);
			camelion(elements.container);
		});

	}
};