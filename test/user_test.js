var expect = require('chai').expect;
var chai = require('chai');
var mongoose = require('mongoose');
var userdal = require("../db/access/userdal");

chai.Assertion.includeStack = true;

suite('User Tests', function(){
    setup(function(done){
        mongoose.connect('mongodb://localhost/frontier', function(err, result) {
            console.log("ERROR:", err);
            if (err) done(err);
            console.log("RESULT", result);
            done();
        });
    });

    suite('#getByUsername', function(){
        test('should be Chris User', function(done){
            userdal.findUserByUsername("chris", function(err, user) {
                if (err) done(err);
                expect(user).to.be.ok;
                expect(user.username).to.be.equal("chris");
                done();
            });
        });
    });
});
