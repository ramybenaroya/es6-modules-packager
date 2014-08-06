import module3 from 'folder-b/module-3';
import $ from 'jquery';

var module2 = {
	initMessage : 'Module 2 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module2.initMessage + ' by ' + initiatorName + '</div>');
		module3.init('module-2');
	}
};
export default module2;