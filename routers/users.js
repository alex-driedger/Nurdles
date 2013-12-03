module.exports = function (app) {

    var mongoose = app.mongoose;
    
    var User = mongoose.model('User');
  
    app.get('/users', ensureAuthenticated, function (req, res) {
        User.find(function (err, users) {
            return res.send(users);
        });
    });
    
    app.post('/users', ensureAuthenticated, function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.setPassword(req.body.password, function (err, user) {
            if (!user) return res.send(500, err);
            user.save(function (err, user) {
                if (!user) return res.send(500, err);
                return res.send(user);
            });
        });
    });
    
    app.get('/users/:id', ensureAuthenticated, function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (!user) return res.send(404, err);
            return res.send(user);
        });
    });
    
    app.put('/users/:id', ensureAuthenticated, function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (!user) return res.send(404, err);
            user.username = req.body.username;
            user.setPassword(req.body.password, function (err, user) {
                if (!user) return res.send(500, err);
                user.save(function (err, user) {
                    if (!user) return res.send(500, err);
                    return res.send(user);
                });
            });
        });
    });
    
    app.delete('/users/:id', ensureAuthenticated, function (req, res) {
        User.findByIdAndRemove(req.params.id, function (err, user) {
            return res.send(user);
        });
    });
    
};