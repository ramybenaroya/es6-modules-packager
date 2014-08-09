module.exports = {
  main: ['transpiled', 'dist', 'tmp'],
  slim: ['transpiled', 'tmp', 'dist/*.js', '!dist/vendor/*.js', '!dist/vendor/*.js.map']
};
