var containerCreator = function (name) {
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
};

var colorGenerator = function(){
	return "#"+((1<<24)*Math.random()|0).toString(16);
};
export { containerCreator, colorGenerator };