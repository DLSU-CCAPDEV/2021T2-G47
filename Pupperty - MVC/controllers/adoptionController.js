const db = require(`../models/db.js`);

const controller = {

	adoptdog: function(req, res){

		db.updateOne(`adoption_posts`, {post_id: req.query.postID}, {$set: {
			owner: req.session.email,
			adoption_status: true
		}}, function(result){
			res.redirect('/userpage');
		})

		
	}
}

module.exports = controller;

