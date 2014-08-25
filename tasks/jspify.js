module.exports = function (grunt) {
	var moment = require('moment'),
		cheerio = require('cheerio'),
		beautify = require('js-beautify').html_beautify;
	grunt.registerTask('jspify:vendor:dev', 'create a jspf for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.vendorDistDir,
			srcPrefix = buildData.vendorSrcDir,
			vendor,
			output, length, i;
		for (vendor in buildData.vendors) {
			output = [];
			appendScriptPrefix(output, vendor, buildData.vendors[vendor]);
			length = buildData.vendors[vendor].length;
			for (i = 0; i < length; i++) {
				output.push('<script generated type="text/javascript" src="/' + srcPrefix + '/' + buildData.vendors[vendor][i] + '.js<%=nonPackagedQueryParams%>"></script>');
			}
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + vendor + '.js.jspf', output.join('\n'));
		}

		function appendScriptPrefix(output, vendor, vendorList) {
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + vendor);
			output.push('\tTotal Included Files:\t' + vendorList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
		}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('jspify:vendor:prod', 'create a jspf for loading one minified vendor script', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.vendorDistDir,
			vendor, output;
		for (vendor in buildData.vendors) {
			output = [];
			appendScriptPrefix(output);
			output.push('<script generated type="text/javascript" src="/' + distPrefix + '/' + vendor + '.js<%=packagedQueryParams%>"></script>');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + vendor + '.js.jspf', grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output) {}

		function appendScriptSuffix(output) {}
	});
	grunt.registerTask('jspify:css:dev', 'create a jspf for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.cssDistDir,
			srcPrefix = buildData.cssSrcDir,
			stylesheet,
			output, length, i;
		for (stylesheet in buildData.stylesheets) {
			output = [];
			appendScriptPrefix(output, stylesheet, buildData.stylesheets[stylesheet]);
			length = buildData.stylesheets[stylesheet].length;
			for (i = 0; i < length; i++) {
				output.push('<link generated type="text/css" rel="stylesheet" href="/' + srcPrefix + '/' + buildData.stylesheets[stylesheet][i] + '.css<%=nonPackagedQueryParams%>">');
			}
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + stylesheet + '.css.jspf', output.join('\n'));
		}

		function appendScriptPrefix(output, stylesheet, stylesheetList) {
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + stylesheet);
			output.push('\tTotal Included Files:\t' + stylesheetList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
		}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('jspify:css:prod', 'create a jspf for loading one minified stylesheet', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.cssDistDir,
			stylesheet, output;
		for (stylesheet in buildData.stylesheets) {
			output = [];
			appendScriptPrefix(output);
			output.push('<link generated type="text/css" rel="stylesheet" href="/' + distPrefix + '/' + stylesheet + '.css<%=packagedQueryParams%>">');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + stylesheet + '.css.jspf', grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output) {}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('jspify:html', 'create a jspf for loading one minified stylesheet script', function () {
		var html = grunt.file.read('index.html');
		$ = cheerio.load(html);
		$('jspf[path]').each(function (i, jspf) {
			var $jspf = $(jspf),
				tag = $jspf.attr('tag'),
				path = $jspf.attr('path'),
				file = grunt.file.read(path)
						.replace(/<%=(.*)%>/g, '')
						.replace(/(\r\n|\n|\r)/gm,"")
						.replace(/<!--This is an auto-generated file for development environment(.*)-->/g,'');
			$(tag + '[generated]').remove()
			$jspf.after('\n' + file + '\n');
		});
		grunt.file.write('index.html', beautify($.html(), {preserve_newlines: false}));
	});
};