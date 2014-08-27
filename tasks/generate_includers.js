module.exports = function (grunt) {
	var moment = require('moment'),
		cheerio = require('cheerio'),
		beautify = require('js-beautify').html_beautify;
	grunt.registerTask('generate_includers:js:dev', 'create an includer file for loading all js packages scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			jsPackages = grunt.file.readJSON('config/js.packages.json'),
			distPrefix = buildData.jsIncludersDistDir,
			includerExtension = buildData.includerExtension,
			srcPrefix = buildData.jsSrcDir,
			jsPackage,
			output, length, i;
		for (jsPackage in jsPackages) {
			output = [];
			appendScriptPrefix(output, jsPackage, jsPackages[jsPackage]);
			length = jsPackages[jsPackage].length;
			for (i = 0; i < length; i++) {
				output.push('<script generated type="text/javascript" src="/' + srcPrefix + '/' + jsPackages[jsPackage][i] + '.js<%=nonPackagedQueryParams%>"></script>');
			}
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + jsPackage + '.js.' + includerExtension, output.join('\n'));
		}

		function appendScriptPrefix(output, jsPackage, filesList) {
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + jsPackage);
			output.push('\tTotal Included Files:\t' + filesList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
		}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('generate_includers:js:prod', 'create an includer file for loading one minified JS package script', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			jsPackages = grunt.file.readJSON('config/js.packages.json'),
			distPrefix = buildData.jsIncludersDistDir,
			includerExtension = buildData.includerExtension,
			jsPackage, output;
		for (jsPackage in jsPackages) {
			output = [];
			appendScriptPrefix(output);
			output.push('<script generated type="text/javascript" src="/' + distPrefix + '/' + jsPackage + '.js<%=packagedQueryParams%>"></script>');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + jsPackage + '.js.' + includerExtension, grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output) {}

		function appendScriptSuffix(output) {}
	});
	grunt.registerTask('generate_includers:css:dev', 'create an includer file for loading all stylesheets synchrounsly', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			cssPackages = grunt.file.readJSON('config/css.packages.json'),
			distPrefix = buildData.cssIncludersDistDir,
			includerExtension = buildData.includerExtension,
			srcPrefix = buildData.cssSrcDir,
			cssPackage,
			output, length, i;
		for (cssPackage in cssPackages) {
			output = [];
			appendScriptPrefix(output, cssPackage, cssPackages[cssPackage]);
			length = cssPackages[cssPackage].length;
			for (i = 0; i < length; i++) {
				output.push('<link generated type="text/css" rel="stylesheet" href="/' + srcPrefix + '/' + cssPackages[cssPackage][i] + '.css<%=nonPackagedQueryParams%>">');
			}
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + cssPackage + '.css.' + includerExtension, output.join('\n'));
		}

		function appendScriptPrefix(output, cssPackage, filesList) {
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + cssPackage);
			output.push('\tTotal Included Files:\t' + filesList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
		}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('generate_includers:css:prod', 'create an includer file for loading one minified stylesheet', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			cssPackages = grunt.file.readJSON('config/css.packages.json'),
			distPrefix = buildData.cssIncludersDistDir,
			includerExtension = buildData.includerExtension,
			cssPackage, output;
		for (cssPackage in cssPackages) {
			output = [];
			appendScriptPrefix(output);
			output.push('<link generated type="text/css" rel="stylesheet" href="/' + distPrefix + '/' + cssPackage + '.css<%=packagedQueryParams%>">');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + cssPackage + '.css.' + includerExtension, grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output) {}

		function appendScriptSuffix(output) {}
	});

	grunt.registerTask('generate_includers:html', 'Append includers', function () {
		var html = grunt.file.read('index.html');
		$ = cheerio.load(html);
		$('include[file]').each(function (i, includer) {
			var $includer = $(includer),
				tag = $includer.attr('tag'),
				path = $includer.attr('file'),
				file = grunt.file.read(path)
						.replace(/<%=(.*)%>/g, '')
						.replace(/(\r\n|\n|\r)/gm,"")
						.replace(/<!--This is an auto-generated file for development environment(.*)-->/g,'');
			$(tag + '[generated]').remove()
			$includer.after('\n' + file + '\n');
		});
		grunt.file.write('index.html', beautify($.html(), {preserve_newlines: false}));
	});
};