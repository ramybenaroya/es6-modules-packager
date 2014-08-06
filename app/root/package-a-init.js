import module1 from 'folder-a/module-1';
import module2 from 'folder-a/module-2';

var packageInit = {
	init: function(){
		module1.init('package-a');
		module2.init('package-a');
	}
};
export default packageInit;