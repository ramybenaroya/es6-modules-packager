var module1 = {
	initMessage : 'Module 2 was initialized',
	init: function(initiatorName){
		$('body').append('<div>' + module1.initMessage + ' by ' + initiatorName + '</div>');
	}
};
export default module1;