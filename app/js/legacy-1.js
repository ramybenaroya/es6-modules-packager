(function(globals){
	if (!globals.legacy2a){
		throw "legacy2A is not defined in the global scope";
	}
	if (!globals.legacy2b){
		throw "legacy2B is not defined in the global scope";
	}
	if (!globals.legacy2c){
		throw "legacy2C is not defined in the global scope";
	}
	
	//Defines global variable
	globals.legacy1 = "Legacy1";	
	$('.console').append('<div>Legacy 1 was loaded</div>');
})(this);