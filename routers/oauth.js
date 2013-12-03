module.exports = function (app) {
    
    var oauth = app.oauth;
    var passport = app.passport;
    
    app.post('/oauth/authenticate/password', [
        ensureAuthenticated, 
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        oauth.token(),
        oauth.errorHandler()
    ]);
    
    app.get('/oauth/authenticate/token', [
        ensureAuthenticated, 
        passport.authenticate(['bearer'], { session: false }),
        function (req, res, next) {
            return res.send(req.user);
        }
    ]);
    
};