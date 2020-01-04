var proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy("/api/shoppingbay/*", { target: "http://localhost:5000" }))
}