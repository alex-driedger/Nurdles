module.exports = function (app) {
    
    var passport = app.passport;
    
    app.post('/authenticate', [
        passport.authenticate('local'),
        function (req, res, next) {
            return res.send({ user: req.user._id, group: req.user.group });
        }
    ]);
    
    app.delete('/authenticate', function (req, res, next) {
        req.logout();
        res.send("access denied");
    });
    
};