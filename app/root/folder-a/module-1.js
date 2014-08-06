import module2 from 'folder-a/module-2';

var module1 = {
	initMessage : 'Module 1 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module1.initMessage + ' by ' + initiatorName + '</div>');
		module2.init('module1');
	}
};
export default module1;