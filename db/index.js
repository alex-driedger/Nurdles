module.exports = function (app) {
    
    var mongoose = app.mongoose;
    
    // Seed users
    var User = mongoose.model('User');
    User.createWithAttributes("appsfactory", "appsfactory", "admin", function (err, user) {
        if (err) return console.log("error, " + err);
    });
    
    // Seed clients
    var Client = mongoose.model('Client');
    Client.createWithClientIdAndSecret("client", "secret", function (err, client) {
        if (err) return console.log("error, " + err);
    });
    
}
