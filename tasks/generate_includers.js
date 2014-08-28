module.exports = function (grunt) {
	var moment = require('moment'),
		cheerio = require('cheerio'),
		beautify = require('js-beautify').html_beautify;
	grunt.registerTask('generate_includers:js:dev', 'create an includer file for loading all js packages scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			jsPackages = grunt.file.readJSON('config/js.packages.json'),
			jsIncludersDistDir = buildData.jsIncludersDistDir,
			includerExtension = buildData.includerExtension,
			jsSrcDir = buildData.jsSrcDir,
			processedPackages = {},
			livereloadDefaultPort = 35729,
			jsPackage,
			output, length, i;
		processJsPackages();
		for (jsPackage in processedPackages) {
			output = [];
			appendScriptPrefix(output, jsPackage, processedPackages[jsPackage]);
			length = processedPackages[jsPackage].length;
			for (i = 0; i < length; i++) {
				output.push('<script generated type="text/javascript" src="/' + jsSrcDir + '/' + processedPackages[jsPackage][i] + '.js<%=nonPackagedQueryParams%>"></script>');
			}
			appendScriptSuffix(output);
			grunt.file.write(jsIncludersDistDir + '/' + jsPackage + '.js.' + includerExtension, output.join('\n'));
		}

		function appendScriptPrefix(output, jsPackage, filesList) {
			var livereloadPort = buildData.livereload !== false ? (buildData.livereload === true ? livereloadDefaultPort : buildData.livereload) : false;
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + jsPackage);
			output.push('\tTotal Included Files:\t' + filesList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
			if (livereloadPort){
				output.push('<script generated="" src="//localhost:' + livereloadPort + '/livereload.js"></script>')	
			}
		}

		function appendScriptSuffix(output) {}

		function processJsPackages() {
			var jsPackage, src;
			for (jsPackage in jsPackages) {
				eachJsPackage(jsPackage);
			}

			function eachJsPackage(jsPackage) {
				src = [];
				analyze(jsPackage, src);
				processedPackages[jsPackage] = src;
			}

			function analyze(jsPackage, array) {
				if (jsPackages[jsPackage]) {
					jsPackages[jsPackage].forEach(function (sub) {
						if (jsPackages[sub] && jsPackages[sub] !== jsPackages[jsPackage]) {
							analyze(sub, array);
						} else {
							array.push(sub);
						}
					});
				}
			}
		};
	});

	grunt.registerTask('generate_includers:js:prod', 'create an includer file for loading one minified JS package script', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			jsPackages = grunt.file.readJSON('config/js.packages.json'),
			jsIncludersDistDir = buildData.jsIncludersDistDir,
			includerExtension = buildData.includerExtension,
			jsDistDir = buildData.jsDistDir,
			jsPackage, output;
		for (jsPackage in jsPackages) {
			output = [];
			appendScriptPrefix(output);
			output.push('<script generated type="text/javascript" src="/' + jsDistDir + '/' + jsPackage + '.js<%=packagedQueryParams%>"></script>');
			appendScriptSuffix(output);
			grunt.file.write(jsIncludersDistDir + '/' + jsPackage + '.js.' + includerExtension, grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output) {}

		function appendScriptSuffix(output) {}
	});
	grunt.registerTask('generate_includers:css:dev', 'create an includer file for loading all stylesheets synchrounsly', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			cssPackages = grunt.file.readJSON('config/css.packages.json'),
			cssIncludersDistDir = buildData.cssIncludersDistDir,
			includerExtension = buildData.includerExtension,
			cssSrcDir = buildData.cssSrcDir,
			processedPackages = {},
			cssPackage,
			output, length, i;
		processCssPackages();
		for (cssPackage in processedPackages) {
			output = [];
			appendScriptPrefix(output, cssPackage, processedPackages[cssPackage]);
			length = processedPackages[cssPackage].length;
			for (i = 0; i < length; i++) {
				output.push('<link generated type="text/css" rel="stylesheet" href="/' + cssSrcDir + '/' + processedPackages[cssPackage][i] + '.css<%=nonPackagedQueryParams%>">');
			}
			appendScriptSuffix(output);
			grunt.file.write(cssIncludersDistDir + '/' + cssPackage + '.css.' + includerExtension, output.join('\n'));
		}

		function appendScriptPrefix(output, cssPackage, filesList) {
			output.push('<!--This is an auto-generated file for development environment');
			output.push('\tPackage Name:\t\t\t' + cssPackage);
			output.push('\tTotal Included Files:\t' + filesList.length);
			output.push('\tGenerated at:\t\t\t' + moment().format('MMMM Do YYYY, h:mm:ss a'));
			output.push('-->');
		}

		function appendScriptSuffix(output) {}

		function processCssPackages() {
			var cssPackage, src;
			for (cssPackage in cssPackages) {
				eachPackage(cssPackage);
			}

			function eachPackage(cssPackage) {
				src = [];
				analyze(cssPackage, src);
				processedPackages[cssPackage] = src;
			}

			function analyze(css, array) {
				if (cssPackages[css]) {
					cssPackages[css].forEach(function (sub) {
						if (cssPackages[sub]) {
							analyze(sub, array);
						} else {
							array.push(sub);
						}
					});
				}
			}
		};
	});

	grunt.registerTask('generate_includers:css:prod', 'create an includer file for loading one minified stylesheet', function () {
		var buildData = grunt.file.readJSON('config/build.json'),
			cssPackages = grunt.file.readJSON('config/css.packages.json'),
			cssIncludersDistDir = buildData.cssIncludersDistDir,
			includerExtension = buildData.includerExtension,
			cssDistDir = buildData.cssDistDir,
			cssPackage, output;
		for (cssPackage in cssPackages) {
			output = [];
			appendScriptPrefix(output);
			output.push('<link generated type="text/css" rel="stylesheet" href="/' + cssDistDir + '/' + cssPackage + '.css<%=packagedQueryParams%>">');
			appendScriptSuffix(output);
			grunt.file.write(cssIncludersDistDir + '/' + cssPackage + '.css.' + includerExtension, grunt.template.process(output.join('\n')));
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
				.replace(/(\r\n|\n|\r)/gm, "")
				.replace(/<!--This is an auto-generated file for development environment(.*)-->/g, '');
			$(tag + '[generated]').remove()
			$includer.after('\n' + file + '\n');
		});
		grunt.file.write('index.html', beautify($.html(), {
			preserve_newlines: false
		}));
	});
};