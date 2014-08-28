import {containerCreator} from 'utils/util-bundle';
import horse from 'animals/mammals/horse';
import giraffe from 'animals/mammals/giraffe';
import lion from 'animals/mammals/lion';
import consoleWriter from 'utils/console';	

consoleWriter('Mammals were loaded');
export
default {
	init: function () {
		var elements = containerCreator('Mammals');
		elements.wrapper.one('click', function () {
			horse(elements.container);
			giraffe(elements.container);
			lion(elements.container);
		});

	}
};