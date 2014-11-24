
/*
 * GET home page.
 */
function routes(app, db) {

  var crypto = require('crypto');

  // Authenticate using our plain-object database of doom!
  function authenticate(username, password, fn) {
    
    // if (!module.parent) console.log('authenticating %s:%s', username, password);

    // Set users
    db.collection('users', function(err, collection) {

      if(err){
        console.log('error', err);
      }

      // Update the document with an atomic operator
      collection.findOne({username:username}, function(err, doc){
        if(err || !doc){
          new Error('Cannot Find User');
        } else {
       
          var hash = crypto.createHmac('sha1', username).update(password).digest('hex');
        
          collection.findOne({username:username, password:hash}, function(err, doc){
            if(err || !doc){
              new Error('invalid password')
            } else {
              return fn(null, doc);
            }
          });            

        }

      });
      
    }); 

  }

  app.get('/login', function(req, res){
     
      req.session = req.session || {user:null};

      if (req.session.user) {

        req.session.success = 'Authenticated as ' + req.session.user.username
      + ' click to <a href="/logout">logout</a>. '
      + ' You may now access <a href="/restricted">/restricted</a>.';
        
        // Return the information of a all collections, using the callback format
        db.collections(function(err, collections) {
          
          res.redirect('/');
          
        });

      } else {
        res.render(__dirname + '/views/login.hbs', { title: 'Login', success: req.session.success, error:req.session.error  });
      }

  });   

  app.post('/login', function(req, res){
    
    authenticate(req.body.username, req.body.password, function(err, user){
      
      if (user) {
    
          // Store the user's primary key 
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          res.redirect('content');
          app.locals.loggedIn  = true;
      } else {
        app.locals.errors = ['Authentication failed, please check your username and password.'];
        res.redirect('login');
      }
    });

  });     

  app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('/');
    });
  });  

}

module.exports = routes;
