const db = require(`../models/db.js`);

const controller = {

	getIndex: function(req, res){
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
		db.findOne(`users`, {email: email, password: password}, function(result){
			if(result == null){
				res.render(`Login`);
				console.log(`Login unsuccessful. User does not exist in the databse.`);
			}
			else{
				db.findMany(`adoption_posts`, {adoption_status: false}, {
					name: 1,
					path: 1,
					post_id: 1
				}, function(result){
					postsArray = result;
					console.log('result ' + postsArray);

					res.render(`HomePage`, {
						u: {
							posts: postsArray
						}
					})
				})

				req.session.email = result.email;
				req.session.name = result.name;
				console.log(`Login successful. User ` + req.session.name + ` ` + req.session.email);
			}
		});
	}
}

module.exports = controller;

