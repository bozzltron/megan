
/*
 * GET home page.
 */
function routes(app, db) {

  var hbs = require('hbs');

  app.get('/collections', function(req, res){
    
    req.session = req.session || {user:null};

    if (req.session.user) {

      req.session.success = 'Authenticated as ' + req.session.user.username
    + ' click to <a href="/logout">logout</a>. '
    + ' You may now access <a href="/restricted">/restricted</a>.';
      
      // Return the information of a all collections, using the callback format
      db.collections(function(err, collections) {
        
        res.render(__dirname + '/../views/collections.hbs', { title: 'Admin', items:collections });
        
      });

    } else {
      res.render(__dirname + '/../views/403.hbs', {});
    }

  });   

  app.get('/collections/:name', function(req, res){
    
    // Return the information of a all collections, using the callback format
    db.collection(req.params.name, function(err, collection) {

      hbs.registerHelper('collection', req.params.name);

      collection.find({}).toArray(function(err, items) {
        res.render(__dirname + '/../views/collection.hbs', { title: req.params.name, items:items });
      });
      
    });

  });     

  app.get('/collections/:name/:id', function(req, res){
    
    // Return the information of a all collections, using the callback format
    db.collection(req.params.name, function(err, collection) {

      hbs.registerHelper('collection', req.params.name);

      if(req.params.id) {

        var mongo = require('mongodb');
        var BSON = mongo.BSONPure;
        var o_id = new BSON.ObjectID(req.params.id);

        collection.findOne({_id:o_id}, function(err, document) {
          res.render(__dirname + '/../views/document.hbs', { document:JSON.stringify(document), _id:document._id });
        });

     }
      
      
    });

  });    

  app.post('/collections/:name/:id', function(req, res){
    
    // Return the information of a all collections, using the callback format
    db.collection(req.params.name, function(err, collection) {

      hbs.registerHelper('collection', req.params.name);

      if(req.params.id) {

        var mongo = require('mongodb');
        var BSON = mongo.BSONPure;
        var o_id = new BSON.ObjectID(req.params.id);

        collection.update({_id:o_id}, {$set:req.body}, function(err, document) {
          res.render(__dirname + '/../views/document.hbs', { document:JSON.stringify(document), _id:document._id });
        });

      }
      
    });

  });    

  app.get('/collections/:name/new', function(req, res){
         
    res.render(__dirname + '/../views/new.hbs', { });

  }); 

  app.post('/collections/:name/new', function(req, res){
    var collectionName = req.params.name;

     // Fetch a collection to insert document into
    var collection = db.collection(req.params.name);

    // Insert a single document
    collection.insert(req.body);

  }); 

}

module.exports = routes;
