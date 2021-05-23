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
		console.log('HERE Email: ' + email + ' successfully registered with Name: ' + password);
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
			  			console.log(`postidvalue` + useridvalue);
					}

						console.log("before = " + email);
						db.findOne(`users`, {email: email}, function(result){
						console.log("after = " + email);
						console.log('uservalue' + useridvalue);

						if(result != null){
							console.log(`Email already registered.`);
							//alert("Email already registered, please try logging in with your email.");
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
								console.log('Email: ' + email + ' successfully registered with Name: ' + person.name);
								req.session.email = person.email;
								req.session.name = person.name;

								
								console.log('SESSION Email: ' + req.session.email + ' successfully registered with SESSION Name: ' + req.session.name);

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

