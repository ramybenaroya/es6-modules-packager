import mammals from 'animals/mammals';
import reptiles from 'animals/reptiles';

export default  {
	init: function(){
		$(function(){
			$('button').one('click', function(){
				mammals.init();
				require('animals/insects', function(insects){
					insects['default'].init();	
				});
				reptiles.init();	
			});
		});
	}
};