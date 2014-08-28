import $ from 'jquery';
export default function(message){
	$('.console').append($('<div></div>').html(message));
}