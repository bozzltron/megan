
/*
 * GET home page.
 */
function routes(app, db) {

	// Setup content pages
	setTimeout(function(){

	  db.collection('content', function(err, collection) {

	    collection.find({}).toArray(function(err, items) {
        
	      if(items) {
  	      items.forEach(function(page, i){
  	      	console.log('registering page', page);
  	      	app.get(page.path, function(req, res){
  	      		res.render(__dirname + '/../views/template.hbs', { title:page.title, body:page.body });
  	      	});
  	      });
        }

	    });
	    
	  });

	}, 1000);

  app.get('/content', function(req, res){

    // Return the information of a all collections, using the callback format
    db.collection('content', function(err, collection) {

      collection.find({}).toArray(function(err, items) {
        res.render(__dirname + '/../views/list.hbs', { items:items });
      });
      
    });

  });   

  app.get('/content/create', function(req, res){

    res.render(__dirname + '/../views/create.hbs');

  });   

  app.post('/content/create', function(req, res){
 	
 		console.log(req.body);
  	if(req.body.title && req.body.path && req.body.body) {

	  	// Fetch a collection to insert document into
		  var collection = db.collection("content");

		  // Insert a single document
		  collection.insert(req.body);

	 		res.redirect('/content');

 		} else {
 			app.locals.errors = ['Title, Body, and Path are required.'];
 			res.render(__dirname + '/../views/create.hbs');
 		}

  });     

  app.get('/content/:id', function(req, res){

    // Return the information of a all collections, using the callback format
    db.collection('content', function(err, collection) {

      if(req.params.id) {

        var mongo = require('mongodb');
        var BSON = mongo.BSONPure;
        var o_id = new BSON.ObjectID(req.params.id);

        collection.findOne({_id:o_id}, function(err, document) {
          res.render(__dirname + '/../views/document.hbs', { document:document });
        });

      }
      
    });

  });    

}

module.exports = routes;
