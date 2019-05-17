const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy(
        '/project',
        { 'target': 'http://192.168.1.42:8050' }
    ))
};
