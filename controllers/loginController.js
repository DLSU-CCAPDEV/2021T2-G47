const db = require(`../models/db.js`);
const bcrypt = require('bcrypt');
const saltRounds = 10;

const controller = {

	getIndex: function(req, res){
		if(req.session.email)
			res.redirect('/homepage');
		else
			res.render(`Login`);
	},

	loginCheck: function(req, res){
		var email = req.body.email;
		var password = req.body.password;
		db.findOne(`users`, {email: email, password: password}, function(result){
	            if(result != null)
	                res.send(result);
	            else
	                res.send(null);
        });
	},

	login: function(req, res){
		// retrieve the data from the form / request
		var email = req.body.email;
		var password = req.body.password;

		// access the database, then save the data
		db.findOne(`users`, {email: email}, function(result){
			if(result == null){
				var details = {error: `Email and/or Password is incorrect.`}
	            res.render('Login', details);
			}
			else{
				bcrypt.compare(password, result.password, function(err, equal) {
	                if(equal){
	                	db.findMany(`adoption_posts`, {adoption_status: false}, {
							name: 1,
							path: 1,
							post_id: 1
						}, function(result){
							postsArray = result;

							res.render(`HomePage`, {
								u: {
									posts: postsArray
								}
							})
						})

						req.session.email = result.email;
						req.session.name = result.name;
	                }
	                else {
	                    var details = {error: `Email and/or Password is incorrect.`}
	                    res.render('Login', details);
	                }
	            });
			}
		});
	}
}

module.exports = controller;

