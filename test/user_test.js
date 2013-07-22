/*var expect = require('chai').expect;
var chai = require('chai');
var initDB = require("../db/init");
var userdal = require("../db/access/userdal");
var testMongoose;

suite('User Tests', function(){
    setup(function(done){
        initDB.createDb(null, function(mongoose) {
            testMongoose = mongoose.createConnection(mongoose);
            done();
        });
    });
    teardown(function() {
        testMongoose.disconnection();
    });

    suite('Basic functions', function(){
        test('should be the "chris" User', function(done){
            userdal.findUserByUsername("chris", function(err, user) {
                expect(err).to.be.null;
                expect(user).not.to.be.null;
                expect(user.username).to.be.equal("chris");
                done();
            });
        });

        test('should have a create function', function(){
            expect(userdal.create).to.be.ok;
        });
    });

});*/
