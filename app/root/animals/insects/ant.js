import {colorGenerator} from 'utils/util-bundle';
export default function($container){
	var $li = $('<li>Ant</li>').css('color', colorGenerator());
	$container.append($li);
}
