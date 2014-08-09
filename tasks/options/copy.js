module.exports = {
	main: {
		files: [{
			expand: true,
			src: ['<%=build.transpiledDir%>/**/.js'],
			dest: '<%=build.transpiledDistDir%>/',
			filter: 'isFile',
			flatten: true
		}]
	}
};