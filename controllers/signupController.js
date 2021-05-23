const db = require(`../models/db.js`);
const bcrypt = require('bcrypt');
const saltRounds = 10;

const controller = {

	openSignup: function(req, res){
		res.render(`Signup`);
	},

	register: function(req, res){
		var email = req.body.email;
		var password = req.body.password;
		var useridstring;
		var useridvalue;

		db.findMany('users', null, {
				user_id: 1
			}, 
			function(result2){

				db.countDocuments('users', function(result){
					if(result == 0)
						useridvalue = 0;
					else{
						useridstring = result2[(result2.length - 1)].user_id;
			  			useridstring = useridstring.split("_");
			  			useridvalue = parseInt(useridstring[1]) + 1;
					}

						db.findOne(`users`, {email: email}, function(result){

						if(result != null){
							res.redirect(`/`);
						} else{

							bcrypt.hash(password, saltRounds, function(err, hash) {
								var person = {
									email: email,
									password: hash,
									name: "user_" + useridvalue,
									bio: "",
									address: "",
									contact: "",
									salary: "",
									certvalid: "",
									user_id: "user_" + useridvalue,
									path: "user.png",
									bgpath: "images/backgrounds/bg1.jpg"

								}
								req.session.email = person.email;
								req.session.name = person.name;

							
								db.insertOne(`users`, person, function(result){
									res.redirect('/edituser');
								});
							})
							
						}
					})
				});
		  	});
	},

	checkEmail: function(req, res){
		var email = req.body.email;
		db.findOne(`users`, {email: email}, function(result){
	            if(result != null)
	                res.send(result);
	            else
	                res.send(null);
	        });
	}
}

module.exports = controller;

