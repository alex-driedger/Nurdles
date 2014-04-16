var LocalStrategy = require('passport-local').Strategy;

var strategies = {
    local: useLocalStrategy
};

function useLocalStrategy(app) {
    var User = app.db.model("User");

    app.passport.use(new LocalStrategy(User.authenticate()));
    app.passport.serializeUser(User.serializeUser());
    app.passport.deserializeUser(User.deserializeUser());
}

var _self = {
    createStrategy: function(strategy, db, passport) {
        strategies[strategy](db, passport);
    }
};

module.exports = _self;
