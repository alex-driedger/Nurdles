var defaultRoutes = require("./default");

function bind(app, passport) {
    app.get("/", defaultRoutes.index);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(null)
}

module.exports = {
    bind: bind,
};

