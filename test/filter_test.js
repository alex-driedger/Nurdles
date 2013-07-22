/*var expect = require('chai').expect;
var chai = require('chai');
var filterdal = require("../db/access/filterdal");
var userdal = require("../db/access/userdal");
var initDB = require("../db/init");
var testMongoose;
var testUser;
var testFilter = {
    owner: "",
    name: "testFilter",
    active: true,
};
var testFilterId;

suite('Filter Tests', function(){
    before(function(done){
        initDB.createDb(null, function(mongoose) {
            testMongoose = mongoose;
            userdal.findUserByUsername("chris", function(err, user) {
                testUser = user;

                filterdal.getById("51e006558df596390e000001", function(err, filter) {
                    testFilter = filter._doc;
                    testFilter._id = filter._id;
                    testFilterId = filter._id;
                    done();
                });
            });
        });

        
    });

    after(function(done) {
        testMongoose.connection.close();


        filterdal.remove(testFilterId, function(err, filter) {
            done();
        });
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

    suite('Filter by ', function(){
        test('filter should have a create function', function(){
            expect(filterdal.create).to.be.ok;
        });
        
        test('filter list should have more than 0 filters', function(done){
           // console.log("TEST", testUser);
            filterdal.getAllForUser(testUser._id, function(err, filters) {
                expect(err).to.be.null;
                expect(filters).not.to.be.null;
                done();
            });
        });
    });

    suite('Update ', function(){
        test('update should have a create function', function(){
            expect(filterdal.update).to.be.ok;
        });
        
        test('updated fields should succesifully be saved', function(done){  
            testFilter.name = "New Name";

            filterdal.update(testFilter._id, testFilter, function(err, numOfFilters) {
                console.log("TEST FILTER: ", testFilter)
                    expect(err).to.not.exist;
                    expect(numOfFilters).not.to.be.null;
                    expect(testFilter.name).to.be.equal("New Name");
                
                    done();
                
            });
        });
    });
suite('Remove ', function(){
        test('should succesifully remove', function(done){  
            console.log("UserID",testFilter._id);
            filterdal.remove(testFilter._id, function(err) {
                    expect(err).to.not.exist;
                    done();
                
            });
        });
    });
});
*/
