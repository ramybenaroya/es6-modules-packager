import $ from 'jquery';

export
default
function (name) {
	var $wrapper = $('<div class="continer"></div>'),
		$title = $('<h1></h1>'),
		$ul = $('<ul></ul>');
	$title.html(name);
	$wrapper.append($title);
	$wrapper.append($ul);
	$('body').append($wrapper);
	return {
		container: $ul,
		wrapper: $wrapper
	};
}