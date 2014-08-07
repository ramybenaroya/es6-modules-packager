module.exports = {
  main: ['transpiled', 'dist'],
  slim: ['transpiled', 'dist/*.js', '!dist/vendor/*.js', '!dist/vendor/*.js.map']
};
