var LocalStrategy = require('passport-local').Strategy;


module.exports = function (app) {
    
    var mongoose = app.mongoose;
    var passport = app.passport;
    
    // Models
    var User = mongoose.model('User');
        
    // Register the function used when authenticating users.
	passport.use(new LocalStrategy(User.authenticate()));
    	
    // Register the user serialization functions.
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
    
    return passport;

};
