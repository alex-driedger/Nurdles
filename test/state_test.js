/*var expect = require('chai').expect;
var chai = require('chai');
var filterdal = require("../db/access/filterdal");
var layerdal = require("../db/access/layerdal");
var userdal = require("../db/access/userdal");
var statedal = require("../db/access/statedal");
var initDB = require("../db/init");
var testMongoose;
var testUser;
var testLayer = {
    owner: "",
    title: "testLayer",
    name: "Test Layer",
    isExactEarth: true,
    isBaseLayer: true,
    active: true,
};
var testFilter = {
    owner: "",
    name: "testFilter",
    active: true,
};
var testLayerId;
var activeFilters;
suite('Layer Tests', function(){
    before(function(done){
        initDB.createDb(null, function(mongoose) {
            testMongoose = mongoose;
            userdal.findUserByUsername("chris", function(err, user) {
                testUser = user;
                //layerdal.getById("51e006558df596390e000001", function(err, layer)//if you want just to retrieve
                layerdal.create(user._id, testLayer, function(err, layer) { //if you want to create a new record
                    //testLayer = layer._doc;
                    console.log(err);
                    testLayer._id = layer._id;
                    testLayerId = layer._id;
                    testLayer.owner = user._id;
                    done();
                });
            });
        });

        
    });

    after(function(done) {
        console.log("LAYER 2",testLayerId);
        testMongoose.connection.close();
        console.log("LAYER 1",testLayerId);
        layerdal.remove(testLayerId, function(err, layer) {
            done();
        console.log("Layer 3",testLayerId);
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

    suite('Layers ', function(){
        test('get all should have a create function', function(){
            expect(layerdal.create).to.be.ok;
        });
        
        test('getting all layers for a user', function(done){
           // console.log("TEST", testUser);
            layerdal.getAllForUser(testUser._id, function(err, layer) {
                expect(err).to.be.null;
                expect(layer).not.to.be.null;
                console.log("HERE ARE LAYERS:", layer)
                done();
            });
        });
    });

    suite('Update ', function(){
        test('layers update should have a create function', function(){
            expect(layerdal.update).to.be.ok;
        });
        
        test('updated fields should succesifully be saved', function(done){  
            testLayer.name = "New Layer";

            layerdal.update(testLayer._id, testLayer, function(err, numOfLayers) {
                console.log("TEST LAYER: ", testLayer)
                    //expect(err).to.not.exist;
                    expect(numOfLayers).not.to.be.null;
                    expect(testLayer.name).to.be.equal("New Layer");
                
                    done();
                
            });
        });
    });

suite('Save State', function(done){
        activeFilters = testFilter;
        test('should successifully  save the filter state', function(done){
        statedal.saveFilterState(testLayer._id, activeFilters, function(err , user ){
                    expect(err).to.not.exist;
                    expect(activeFilters).not.to.be.null;
                    done();
                
            });
        });
    });
   
suite('Remove ', function(){
        test('should succesifully remove', function(done){  
            console.log("UserID",testLayer.owner);
            layerdal.remove(testLayer.owner, function(err) {
                    expect(err).to.not.exist;
                    done();
                
            });
        });
    });
});

*/