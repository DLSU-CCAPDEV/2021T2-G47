const db = require(`../models/db.js`);

const controller = {

	homepage: function(req, res){
		var u;
		var postsArray;

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
	}
}

module.exports = controller;

