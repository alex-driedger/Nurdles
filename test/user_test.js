var expect = require('chai').expect;
var chai = require('chai');
var initDB = require("../db/init");
//var userdal = require("../db/access/userdal");
var User = require('../db/models/User').User;

chai.Assertion.includeStack = true;

suite('User Tests', function(){
    setup(function(done){
        initDB.createDb(null, function(mongoose) {
            done();
        });
    });

    suite('#getByUsername', function(){
        test('should be Chris User', function(done){
            User.findByUsername("chris", function(err, user) {
                if (err) done(err);
                expect(user).to.be.ok;
                expect(user.username).to.be.equal("chris");
                done();
            });
        });
    });
});
