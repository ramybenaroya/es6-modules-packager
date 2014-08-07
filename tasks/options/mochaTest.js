module.exports = {
  test: {
    src: [
      'test/vendor/assert.js',
      'test/test-adapter.js',
      'transpiled/tests.cjs.js'
    ],
    options: {
      reporter: 'spec'
    }
  }
};
