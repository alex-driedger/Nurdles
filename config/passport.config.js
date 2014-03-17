var LocalStrategy = require('passport-local').Strategy;

var strategies = {
    local: useLocalStrategy
};

function useLocalStrategy(app) {
    var User = app.db.model("User");
    // I think this is where you change it to email but not sure how
    // console.log(User.authenticate()+"hi")
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
