const db = require(`../models/db.js`);

const controller = {

	checksearch: function(req,res){
		var radioRes = req.query.searchradio;
		var searchText = req.query.text;

		if(radioRes == 'profileName'){
			db.findMany(`users`, {name: {$regex: ".*" + searchText + ".*"}}, {
				user_id: 1,
				name: 1,
				bio: 1,
				path: 1
				}, function(result){
					usersArray = result;
					console.log('ASDHFGASKDJHFDresult ' + usersArray[0].name);
					console.log('user: ' + req.session.name);

					db.findMany(`adoption_posts`, {poster_email: req.session.email, adoption_status: false}, {
						name: 1,
						path: 1,
					}, function(result){num_user_posts = result.length;})

					db.findMany(`adoption_posts`, {owner: req.session.email}, {
						name: 1,
						path: 1,
					}, function(result){num_adopted = result.length;})

					db.countDocuments('users', function(result3){
						db.findOne(`users`, {email: req.session.email}, function(result2){
							res.render(`UserResults`, {
								u: {
									currentUser: result2.name,
									user_id: result2.user_id,
									user_photo: result2.path,
									num_user_posts: num_user_posts,
									num_adopted: num_adopted,
									users: result,
									num_posts: result.length,
									num_users: result3
								}
							})
						})
					});		
			})
		}
		else if(radioRes == 'petName'){
			db.findMany(`adoption_posts`, {name: {$regex: ".*" + searchText + ".*"}}, {
				poster: 1,
				path: 1,
				remarks: 1,
				post_date: 1,
				post_time: 1,
				post_id: 1,
				poster_picture: 1,
				poster_id: 1,
				upvotes: 1
				}, function(result){
					postsArray = result;
					console.log('result ' + postsArray);
					console.log('user: ' + req.session.name);

					db.findMany(`adoption_posts`, {poster_email: req.session.email, adoption_status: false}, {
						name: 1,
						path: 1,
					}, function(result){num_user_posts = result.length;})

					db.findMany(`adoption_posts`, {owner: req.session.email}, {
						name: 1,
						path: 1,
					}, function(result){num_adopted = result.length;})

					db.countDocuments('users', function(result3){
						db.findOne(`users`, {email: req.session.email}, function(result2){
							res.render(`Browse`, {
								u: {
									currentUser: result2.name,
									user_id: result2.user_id,
									user_photo: result2.path,
									num_user_posts: num_user_posts,
									num_adopted: num_adopted,
									posts: postsArray,
									num_posts: result.length,
									num_users: result3
								}
							})
						})
					});		
			})
		}
		else if(radioRes == 'petBreed'){
			db.findMany(`adoption_posts`, {breed: {$regex: ".*" + searchText + ",*"}}, {
			poster: 1,
			path: 1,
			remarks: 1,
			post_date: 1,
			post_time: 1,
			post_id: 1,
			poster_picture: 1,
			poster_id: 1,
			upvotes: 1
			}, function(result){
				postsArray = result;
				console.log('result ' + postsArray);
				console.log('user: ' + req.session.name);

				db.findMany(`adoption_posts`, {poster_email: req.session.email, adoption_status: false}, {
					name: 1,
					path: 1,
				}, function(result){num_user_posts = result.length;})

				db.findMany(`adoption_posts`, {owner: req.session.email}, {
					name: 1,
					path: 1,
				}, function(result){num_adopted = result.length;})

				db.countDocuments('users', function(result3){
					db.findOne(`users`, {email: req.session.email}, function(result2){
						res.render(`Browse`, {
							u: {
								currentUser: result2.name,
								user_id: result2.user_id,
								user_photo: result2.path,
								num_user_posts: num_user_posts,
								num_adopted: num_adopted,
								posts: postsArray,
								num_posts: result.length,
								num_users: result3
							}
						})
					})
				});		
			})
		}
		else if(radioRes == 'faqTitle'){
			db.findOne('FAQS', {title: searchText}, function(result){
		  		var question = 
		  		{
		  			name: result.name,
					title: result.title,
					text: result.text,
		  		}

		  		res.render('indivFAQ', question);
		  	});
		}

		console.log(`RADIORES =` + radioRes);
		console.log(`checksearchEntry = ` + req.query.text);
	}
}

module.exports = controller;

