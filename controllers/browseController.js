const db = require(`../models/db.js`);

const controller = {

	addpost: function(req, res){
		res.render(`AddPost`);
	},

	upvote: function(req, res){
		var post_id = req.query.postID;
		db.findOne('adoption_posts', {post_id: post_id}, function(result){
			db.updateOne(`adoption_posts`, {post_id: post_id}, {$set: {
				upvotes: result.upvotes + 1
			}}, function(result){});
		});
	},

	browse: function(req, res){
		var u;
		var postsArray;
		var num_user_posts;
		var num_adopted;

		db.findMany(`adoption_posts`, {adoption_status: false}, {
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

			db.findMany(`adoption_posts`, {poster_email: req.session.email, adoption_status: false}, {
				name: 1,
				path: 1,
			}, function(result4){
				num_user_posts = result4.length;
				db.findMany(`adoption_posts`, {owner: req.session.email}, {
					name: 1,
					path: 1,
				}, function(result5){
					num_adopted = result5.length;
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
			})
		})
	},

	adoption: function(req, res){

		var postid = req.query.postID;

		db.findOne(`adoption_posts`, {post_id: postid}, function(result){
			res.render(`Adoption`, {
				p: {
					name: result.name,
					breed: result.breed,
					sex: result.sex,
					size: result.size,
					age: result.age,
					remarks: result.remarks,
					status: result.adoption_status,
					path: result.path,
					postid: result.post_id,
					posternumber: result.poster_contact,
					posteremail: result.poster_email,
					poster_address: result.poster_address,
					poster_id: result.poster_id,
					poster_picture: result.poster_picture,
					medHistory: result.medical
				}
			});
		})
	},

	profile: function(req, res){
		var user_id = req.query.username;
		var adoptCount;

		db.findOne(`users`, {email: req.session.email}, function(result)
		{

			if(result.user_id == user_id)
				res.redirect('userpage');
			else
			{
				var u;
				var questionsArray;
				var postsArray;
				var adoptArray;
				var adoptCount;
				var postsCount;

				db.findMany(`FAQS`, {asker_id: user_id}, {
					author: 1,
					name: 1,
					title: 1,
					text: 1,
					question_id: 1
				}, function(result2){
					questionsArray = result2;
					db.findMany(`adoption_posts`, {poster_id: user_id}, {
						name: 1,
						path: 1,
						adoption_status: 1,
						post_id: 1
					}, function(result3){
						postsArray = result3;
						db.findMany(`adoption_posts`, {owner: user_id}, {
							name: 1,
							path: 1,
						}, function(result4){
							adoptArray = result4;
							if(adoptArray == undefined){
								adoptCount = 0;
							} else{
								adoptCount = adoptArray.length;
							}

							if(postsArray == undefined){
								postsCount = 0;
							} else{
								postsCount = postsArray.length;
							}

							db.findOne(`users`, {user_id: user_id}, function(result5){

								res.render(`otherusers`, {
									u: {
										email: result5.email,
										name: result5.name,
										bio: result5.bio,
										address: result5.address,
										contact: result5.contact,
										salary: result5.salary,
										certvalid: result5.certvalid,
										adoptcount: adoptCount,
										rescuecount: postsCount,
										path: result5.path,
										questions: questionsArray,
										posts: postsArray,
										adopts: adoptArray,
										certificate: result5.certificate,
										bgpath: result5.bgpath
									}
								});
							})
						})
					})
				})
			}
		});
	}
}

module.exports = controller;

