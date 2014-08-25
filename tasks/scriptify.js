module.exports = function(grunt) {
	grunt.registerTask('scriptify', 'create a script for loading all vendor scripts synchrounsly', function () {
		var buildData = grunt.file.readJSON('build.json'),
			distPrefix = buildData.vendorDistDir,
			srcPrefix = buildData.vendorSrcDir,
			vendor,
			output, length, i;
		for (vendor in buildData.vendors) {
			output = [];
			appendScriptPrefix(output);
			length = buildData.vendors[vendor].length;
			for (i = 0; i < length - 1; i++) {
				output.push('\t\t\t"' + srcPrefix + '/' + buildData.vendors[vendor][i] + '.js",');
			}
			output.push('\t\t\t"' + srcPrefix + '/' + buildData.vendors[vendor][i] + '.js"');
			appendScriptSuffix(output);
			grunt.file.write(distPrefix + '/' + vendor + '.js', grunt.template.process(output.join('\n')));
		}

		function appendScriptPrefix(output){
			output.push('(function(globals) {');
			output.push('\tvar i, length,');
			output.push('\t\tsrcs = [');
		}

		function appendScriptSuffix(output){
			output.push('\t\t];');
			output.push('\tlength = srcs.length;');
			output.push('\tfor(i = 0; i < length; i++){');
			output.push('\t\tglobals.document.write(\'<script type="text/javascript" src="\' + srcs[i] + \'"><\/script>\');');
			output.push('\t}');
			output.push('})(window);');
		}
	});
};
