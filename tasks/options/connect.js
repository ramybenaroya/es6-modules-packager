module.exports = {
  server: {},

  options: {
    hostname: '127.0.0.1',
    port: 9001,
    base: '.',
    middleware: function (connect, options) {
      return [
        require('connect-redirection')(),
        function (req, res, next) {
          if (req.url === '/') {
            res.redirect('/index.html');
          } else {
            next();
          }
        },
        connect.static(options.base)
      ];
    }

  }
};