
/*
 * GET home page.
 */
function routes(app, db) {

	app.get('/', function(req, res){
	  res.render('index.hbs', { title: 'My Doula Donis'});
	});

	app.get('/about', function(req, res){
	  res.render('about.hbs', { title: 'About' });
	});

	app.get('/contact', function(req, res){
	  res.render('contact.hbs', { title: 'Contact' });
	});	

	app.post('/contact', function(req, res){
	  // Send Email

	  	var time = new Date().getTime();

	  	if(time - parseInt(req.body.time, 10) > 5000) {

		  	//process.env.SENDGRID_USERNAME
		  	//process.env.SENDGRID_PASSWORD
			var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
			sendgrid.send({
			  to:       'mydouladonis@gmail.com',
			  from:     req.body.email,
			  subject:  'A Message From My Doula Donis',
			  text:     'From : ' + req.body.name + ' ' + req.body.email + ' Message: '  + req.body.message
			}, function(err, json) {
			  if (err) { return console.error(err); }

			  res.json(json);

			});

		} else {
			res.json({status:"error", message:"You filled this out too fast to be a human."})
		}

	});	

}

module.exports = routes;