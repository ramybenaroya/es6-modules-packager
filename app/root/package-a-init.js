import module1 from 'folder-a/module-1';
var packageInit = {
	init: function(){
		module1.init('package-a');
	}
};
export default packageInit;