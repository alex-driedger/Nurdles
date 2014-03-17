var path = require("path");
var user = require(path.join(__dirname, "..", "models", "user"));
var mongoose = require("mongoose")
var nodemailer = require("nodemailer");
var self = {
    create: function(req, res) {

        var User = mongoose.model('User')
        var username = req.body.username.toLowerCase()
        var atpos=username.indexOf("@");
        var dotpos=username.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=username.length)
        {
            res.send({ObjectId: "", message:"Invalid Email"})
        } else
        {
            User.register(new User({ username: username }), req.body.password, function (err, user) {
                if (err)
                {
                    console.log(err)
                    res.send(err)
                } else
                {
                    // This method will send an email to nurdlestestmail@gmail.com
                    var smtpTransport = nodemailer.createTransport("SMTP",{
                        service: "Gmail",
                        auth: {
                            user: "nurdlestestmail@gmail.com",
                            pass: "Nurdles1"
                        }
                    });
                    var mailOptions = {
                        from: "Nurdles <nurdlestestmail@gmail.com>", // sender address
                        //  Send it to "username" 
                        to: "nurdlestestmail@gmail.com, nurdlestestmail@gmail.com", // list of receivers
                        subject: "USER CREATED - " + username, // Subject line
                        text: "User created under username " + username, // plaintext body
                        html: "<b>User created under username "+ username + "</b>" // html body
                    }
                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent: " + response.message);
                        }
                    })
                    res.send(user)
                }
            });
        }
    },

    find: function(req, res) {
        var User = mongoose.model('User')
                User.find(function(err, data)
        {
            res.send(data)
        })
    },
    loginSuccess: function(req, res) {
        var returnedUser = {};
        var user = req.user;
        returnedUser.userId = user._id;

        res.statusCode = 200;
        console.log(user)
        res.send(returnedUser);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect("/");
    },

    routeCallback: function(req, res, err, object) {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            req.login(object, function(err) {
                if (err)
                    console.log("ERROR:", err)
                else {
                    res.send(object);
                }
            });
        }
    }
};

module.exports = self;
