function nameFor(path) {
  var result,  match;
  if (match = path.match(/^(?:root|test|test\/tests)\/(.*?)(?:\.js)?$/)) {
    result = match[1];
  } else {
    result = path;
  }

  return path;
}

module.exports = {
  amd: {
    moduleName: nameFor,
    type: 'amd',
    files: [{
      expand: true,
      cwd: '<%=pkg.root%>/',
      src: ['**/*.js'],
      dest: 'tmp/root',
      ext: '.js'
    }]
  },

  testsAmd: {
    moduleName: nameFor,
    type: 'amd',
    src: ['test/test_helpers.js', 'test/tests.js', 'test/tests/**/*_test.js'],
    dest: 'tmp/tests.amd.js'
  }
};
