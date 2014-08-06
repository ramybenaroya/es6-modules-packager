import $ from 'jquery';

var module3 = {
	initMessage : 'Module 3 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module3.initMessage + ' by ' + initiatorName + '</div>');
	}
};
export default module3;