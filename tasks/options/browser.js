module.exports = {
  dist: {
    src: 'dist/browser.js',
    dest: 'dist/modules-<%= pkg.version %>.js'
  },
  distNoVersion: {
    src: 'tmp/browser.js',
    dest: 'dist/modules.js'
  }
};
