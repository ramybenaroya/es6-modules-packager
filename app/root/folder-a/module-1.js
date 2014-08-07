import $ from 'jquery';
import module4 from 'folder-b/module-4';

var module1 = {
	/**
		Init message const
	*/
	initMessage : 'Module 1 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module1.initMessage + ' by ' + initiatorName + '</div>');
		module4();
	}
};
export default module1;