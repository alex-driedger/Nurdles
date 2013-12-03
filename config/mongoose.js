module.exports = function (app) {
    
    var mongoose = app.mongoose;
  
    var uri = process.env.MONGOLAB_URI || 
                  process.env.MONGOHQ_URL  || 
                      'mongodb://localhost/pattern';
    var options = { db: { safe: true }};

    mongoose.connect(uri,  options);
    
    return mongoose;
    
};