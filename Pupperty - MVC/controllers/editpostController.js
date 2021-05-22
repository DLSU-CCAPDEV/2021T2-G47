const db = require(`../models/db.js`);

const controller = {

	submiteditedpost: function(req, res){

		console.log("queryedit" + req.body.edit);
		
		db.updateOne(`adoption_posts`, {post_id: req.body.edit}, {$set: {
			name: req.body.name,
			breed: req.body.breed,
			sex:  req.body.sex,
			size: req.body.size,
			age: req.body.age,
			medical: req.body.medical,
			remarks: req.body.remarks
		}});

		if(req.file != undefined){
			db.updateOne(`adoption_posts`, {post_id: req.body.edit}, {$set: {
				image: req.file,
				path: req.file.filename
			}});
		}

		res.redirect('/userpage');

	}
}

module.exports = controller;

