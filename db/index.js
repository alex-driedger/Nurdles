module.exports = function (app) {
    
    var mongoose = app.mongoose;
    
    // Seed users
    var User = mongoose.model('User');
    
    User.createWithUsernameAndPassword("appsfactory", "appsfactory", function (err, user) {
        if (err) return console.log("error, " + err);
    });
    
    // Seed clients
    var Client = mongoose.model('Client');
    Client.createWithClientIdAndSecret("client", "secret", function (err, client) {
        if (err) return console.log("error, " + err);
    });
    
}
