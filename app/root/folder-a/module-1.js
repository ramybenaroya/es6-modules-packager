import $ from 'jquery';

var module1 = {
	initMessage : 'Module 1 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module1.initMessage + ' by ' + initiatorName + '</div>');
	}
};
export default module1;