const db = require(`../models/db.js`);

const controller = {

	submitadoptionpost: function(req, res){
		var postidstring;
		var postidvalue;

		db.findMany('adoption_posts', null, {
				post_id: 1
			}, 
			function(result2){
				db.countDocuments('adoption_posts', function(result){

					if(result == 0){
						postidvalue = 0;
					}
					else{
			  			postidstring = result2[(result2.length - 1)].post_id;
			  			postidstring = postidstring.split("_");
			  			postidvalue = parseInt(postidstring[1]) + 1;
		  			}

		  			db.findOne('users', {email: req.session.email}, function(result2){
		  				var dog = {
							poster: req.session.name,
							poster_email: req.session.email,
							poster_contact: result2.contact,
							poster_picture: result2.path,
							poster_id: result2.user_id,
							poster_address: result2.address,
							name: req.body.name,
							breed: req.body.breed,
							sex: req.body.sex,
							size: req.body.size,
							age: req.body.age,
							remarks: req.body.remarks,
							medical: req.body.medical,
							image: req.file,
							path: req.file.filename,
							owner: "N/A",
							adoption_status: false,
							post_id: "post_" + postidvalue,
							post_date: new Date().getMonth() + "-" + new Date().getDate() + "-" + new Date().getFullYear(),
							post_time: new Date().getHours() + ":" + new Date().getMinutes(),
							upvotes: 0
						}

						db.insertOne(`adoption_posts`, dog, function(result){
							res.redirect('/browse');
						});
		  			});
				});
		  	})
	}
}

module.exports = controller;

