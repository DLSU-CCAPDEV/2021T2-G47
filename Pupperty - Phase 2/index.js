const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const fs = require(`fs`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const db = require('./models/db.js')
const hbs = require(`hbs`);
const multer = require('multer');

// DB_URL=mongodb+srv://Admin:AdminPupperty@pupperty.ps47i.mongodb.net/database?retryWrites=true&w=majority

const storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, './public/uploads');
	},
	filename: function(req, file, callback){
		callback(null, new Date().getMonth() + "-" + new Date().getDate() + "-" + new Date().getFullYear() + "_" + new Date().getHours() + "-" + new Date().getMinutes() + "_" + file.originalname);
	}
})

const upload = multer({storage: storage});

hbs.registerPartials(__dirname + '/views/partials');

const app = express();
app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

// limit an array to a maximum of elements (from the start)
hbs.registerHelper('limit', function (arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  return arr.slice(0, limit);
})

hbs.registerHelper('reverseArray', (array) => array.reverse());

//global variables
var logName;
var logEmail;

app.get(`/`, function(req, res){
	res.render(`Login`);
})

app.get(`/signup`, function(req, res){
	res.render(`Signup`);
})

app.get(`/homepage`, function(req, res){
	var u;
	var postsArray;

	console.log("Email and name of current session: "+ logEmail + " -- " + logName);

	db.findMany(`adoption_posts`, {adoption_status: false}, {
		name: 1,
		path: 1
	}, function(result){
		postsArray = result;
		console.log('result ' + postsArray);

		res.render(`HomePage`, {
			u: {
				posts: postsArray
			}
		})
	})
})

app.post(`/submitcertificate`,  upload.single('image'), function(req, res){

	db.updateOne(`users`, {email: logEmail}, {$set: {
		certificate: req.file.filename
	}})

	res.redirect('/userpage');
})


app.get(`/userpage`, function(req, res){

	var u;
	var questionsArray;
	var postsArray;
	var adoptArray;

	console.log("Email and name of current session: "+ logEmail + " -- " + logName);

	db.findMany(`FAQS`, {author: logEmail}, {
		author: 1,
		name: 1,
		title: 1,
		text: 1,
		question_id: 1
	}, function(result){questionsArray = result;})

	db.findMany(`adoption_posts`, {poster_email: logEmail}, {
		name: 1,
		path: 1,
		adoption_status: 1,
		post_id: 1
	}, function(result){postsArray = result;})

	db.findMany(`adoption_posts`, {owner: logEmail}, {
		name: 1,
		path: 1,
		adoption_status: 1,
		post_id: 1
	}, function(result){adoptArray = result;})

	db.findOne(`users`, {email: logEmail}, function(result2){
		console.log('result' + result2.name);

		res.render(`userpage`, {
			u: {
				email: result2.email,
				name: result2.name,
				bio: result2.bio,
				address: result2.address,
				contact: result2.contact,
				salary: result2.salary,
				certvalid: result2.certvalid,
				adoptcount: result2.homeowner.length,
				rescuecount: result2.rescuer.length,
				path: result2.path,
				questions: questionsArray,
				posts: postsArray,
				adopts: adoptArray,
				certificate: result2.certificate

			}
		});
	})
})

app.get('/profile', function(req, res){
	var user_id = req.query.username;

	db.findOne(`users`, {email: logEmail}, function(result)
	{
		if(result.user_id == user_id)
			res.redirect('userpage');
		else
		{
			var u;
			var questionsArray;
			var postsArray;
			var adoptArray;

			console.log("Userid current page: "+ user_id + " -- " + req.body.username);

			db.findMany(`FAQS`, {asker_id: user_id}, {
				author: 1,
				name: 1,
				title: 1,
				text: 1,
				question_id: 1
			}, function(result){questionsArray = result;})

			db.findMany(`adoption_posts`, {poster_id: user_id}, {
				name: 1,
				path: 1,
				adoption_status: 1,
				post_id: 1
			}, function(result){postsArray = result;})

			db.findMany(`adoption_posts`, {owner: user_id}, {
				name: 1,
				path: 1,
			}, function(result){adoptArray = result;})

			db.findOne(`users`, {user_id: user_id}, function(result2){
				console.log('result' + result2.name);

				res.render(`otherusers`, {
					u: {
						email: result2.email,
						name: result2.name,
						bio: result2.bio,
						address: result2.address,
						contact: result2.contact,
						salary: result2.salary,
						certvalid: result2.certvalid,
						adoptcount: result2.homeowner.length,
						rescuecount: result2.rescuer.length,
						path: result2.path,
						questions: questionsArray,
						posts: postsArray,
						adopts: adoptArray,
						certificate: result2.certificate
					}
				});
			})
		}
	});
})

app.get(`/addpost`, function(req, res){
	res.render(`AddPost`);
})

app.get(`/adoption`, function(req, res){

	var postid = req.query.postID;
	console.log("adoption postid" + postid)

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
				posteremail: result.poster_email
			}
		});
	})

})

app.get('/adoptdog', function(req, res){

	db.updateOne(`adoption_posts`, {post_id: req.query.postID}, {$set: {
		owner: logEmail,
		adoption_status: true
	}})

	res.redirect('/userpage')
})

app.post(`/submiteditedpost`, upload.single('image'), function(req, res){

	console.log("queryedit" + req.body.edit);
	
	db.updateOne(`adoption_posts`, {post_id: req.body.edit}, {$set: {
		name: req.body.name,
		breed: req.body.breed,
		sex:  req.body.sex,
		size: req.body.size,
		age: req.body.age,
		remarks: req.body.remarks,
	}});

	if(req.file != undefined){
		db.updateOne(`adoption_posts`, {post_id: req.body.edit}, {$set: {
			image: req.file,
			path: req.file.filename
		}});
	}

	res.redirect('/userpage');

})

app.get(`/editpost`, function(req, res){

	var d;
	var hbsex, hbsize;

	db.findOne(`adoption_posts`, {post_id: req.query.post}, function(result){

	if(result.sex == "Male"){
		hbsex = "<input type='radio' id = 'male' name = 'sex' value = 'Male' checked> <label for = 'male'>Male</label> <input type='radio' id = 'female' name = 'sex' value = 'Female'> <label for = 'female'>Female</label> <br><br>"
	} else{
		hbsex = "<input type='radio' id = 'male' name = 'sex' value = 'Male'> <label for = 'male'>Male</label> <input type='radio' id = 'female' name = 'sex' value = 'Female' checked> <label for = 'female'>Female</label> <br><br>"
	}

	if(result.size == "Small"){
		hbsize = "<input type='radio' id = 'small' name = 'size' value = 'Small' checked> <label for = 'small'>Small</label> <input type='radio' id = 'medium' name = 'size' value = 'Medium'> <label for = 'medium'>Medium</label> <input type='radio' id = 'large' name = 'size' value = 'Large'> <label for = 'large'>Large</label> <br><br>"
	}
	else if(result.size == "Medium"){
		hbsize = "<input type='radio' id = 'small' name = 'size' value = 'Small'> <label for = 'small'>Small</label> <input type='radio' id = 'medium' name = 'size' value = 'Medium' checked> <label for = 'medium'>Medium</label> <input type='radio' id = 'large' name = 'size' value = 'Large'> <label for = 'large'>Large</label> <br><br>"
	}
	else{
		hbsize = "<input type='radio' id = 'small' name = 'size' value = 'Small'> <label for = 'small'>Small</label> <input type='radio' id = 'medium' name = 'size' value = 'Medium'> <label for = 'medium'>Medium</label> <input type='radio' id = 'large' name = 'size' value = 'Large' checked> <label for = 'large'>Large</label> <br><br>"
	}

	res.render(`EditPost`, {
		d:{
			name: result.name,
			path: result.path,
			breed: result.breed,
			sex:  hbsex,
			size: hbsize,
			age: result.age,
			remarks: result.remarks,
			postid : result.post_id
			}
		});	
	});
})

app.post(`/submiteditedquestion`, function(req, res){
	db.updateOne(`FAQS`, {question_id: req.body.question}, {$set: {
		title: req.body.title,
		text: req.body.text
	}});
	
	res.redirect('/FAQ');
})

app.get(`/editquestion`, function(req, res){

	var user;
	var q;

	db.findOne(`users`, {email: logEmail}, function(result2){
		user = result2;

		db.findOne(`FAQS`, {question_id: req.query.question}, function(result){
		res.render(`EditQuestion`, {
			q:{
				name: result2.name,
				path: result2.path,
				title:  result.title,
				text: result.text,
				question_id: req.query.question
				}
			});	
		});
	});
})

app.get(`/edituser`, function(req, res){

	var prev;

	db.findOne(`users`, {email: logEmail}, function(result){

		console.log('final result = ' + result);
		
		res.render(`edituserpage`, {
			prev: {
				name: "<input type = 'text' id = 'usernameform' name = 'usernameform' value = '" + result.name + "' size = '58'>",
				bio: result.bio,
				address: "<input type = 'text' id = 'addressform' name = 'addressform' value = '" + result.address + "' size = '58'>",
				contact: "<input type = 'text' id = 'numberform' name = 'numberform' value = '" + result.contact + "' size = '58'>",
				salary: "<input type = 'text' id = 'moneyform' name = 'moneyform' value = '" + result.salary + "' size = '58'>",
				image: result.path
			}
		})
	})	
})

app.post(`/submitedit`, upload.single('image'), function(req, res){

	console.log(`REQFILE = ` + req.file);

	var image;

	db.updateMany(`adoption_posts`, {poster_email: logEmail}, {$set: {
		poster: req.body.usernameform
	}})

	db.updateMany(`FAQS`, {author: logEmail}, {$set: {
		name: req.body.usernameform
	}})

	db.updateOne(`users`, {email: logEmail}, {$set: {
		name: req.body.usernameform,
		bio: req.body.bioform,
		address: req.body.addressform,
		contact: req.body.numberform,
		salary: req.body.moneyform,
		test: req.body.savechanges
	}})

	if(req.file != undefined){
		db.updateOne(`users`, {email: logEmail}, {$set: {
			image: req.file,
			path: req.file.filename
		}})
	}

	res.redirect('/userpage');
})

app.get(`/FAQ`, function(req, res){
	var q;

	  db.findMany('FAQS', null,
	  	{
	  		author: 1,
	  		name: 1,
	  		title:1, 
	  		text:1
	  	}, function(result){
	  		db.findOne(`users`, {email: logEmail}, function(result2){
		  		 res.render('FAQ', {
		  		 	q: result,
		  		 	name: logName,
		  		 	path: result2.path
		  		 });
		  	});
	  })
})

app.get(`/browse`, function(req, res){
	var u;
	var postsArray;
	var num_user_posts;
	var num_adopted;

	console.log("Email and name of current session: "+ logEmail + " -- " + logName);

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
		console.log('result ' + postsArray);
		console.log('user: ' + logName);

		db.findMany(`adoption_posts`, {poster_email: logEmail, adoption_status: false}, {
			name: 1,
			path: 1,
		}, function(result){num_user_posts = result.length;})

		db.findMany(`adoption_posts`, {owner: logEmail}, {
			name: 1,
			path: 1,
		}, function(result){num_adopted = result.length;})

		db.countDocuments('users', function(result3){
			db.findOne(`users`, {email: logEmail}, function(result2){
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

app.post(`/login`, function(req, res){
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
				path: 1
			}, function(result){
				postsArray = result;
				console.log('result ' + postsArray);

				res.render(`HomePage`, {
					u: {
						posts: postsArray
					}
				})
			})

			logEmail = result.email;
			logName = result.name;
			console.log(`Login successful. User ` + logName + ` ` + logEmail);
		}
	});
})

app.post(`/register`, function(req, res){

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
		  			console.log(`postidvalue` + useridvalue);
				}

					db.findOne(`users`, {email: email}, function(result){

					console.log('uservalue' + useridvalue);

					if(result != null){
						console.log(`Email already registered.`);
						//alert("Email already registered, please try logging in with your email.");
						res.redirect(`/`);
					} else{
						var person = {
							email: email,
							password: password,
							name: "user_" + useridvalue,
							bio: "",
							address: "",
							contact: "",
							salary: "",
							certvalid: "",
							homeowner: [],
							rescuer: [],
							user_id: "user_" + useridvalue,
							path: "user.png"
						}

						console.log('Email: ' + logEmail + ' successfully registered with Name: ' + logName);
						logEmail = email;
						logName = person.name;

						db.insertOne(`users`, person, function(result){
							res.redirect('/edituser');
						});
						
					}
				})
			});
	  	});
})

app.post(`/submitadoptionpost`, upload.single('image'), function(req, res){
	console.log(req.file);
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
		  			console.log(`postidvalue` + postidvalue);
	  			}

	  			db.findOne('users', {email: logEmail}, function(result2){
	  				var dog = {
						poster: logName,
						poster_email: logEmail,
						poster_contact: result2.contact,
						poster_picture: result2.path,
						poster_id: result2.user_id,
						name: req.body.name,
						breed: req.body.breed,
						sex: req.body.sex,
						size: req.body.size,
						age: req.body.age,
						remarks: req.body.remarks,
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
})
app.post(`/submitFAQ`, function(req, res){

	var questionidstring;
	var questionidvalue;

	db.findMany('FAQS', null, {
			question_id: 1
		}, 
		function(result2){

  			db.countDocuments('FAQS', function(result){

  				if(result == 0){
  					questionidvalue = 0;
  				} else{
  					questionidstring = result2[(result2.length - 1)].question_id;
		  			questionidstring = questionidstring.split("_");
		  			questionidvalue = parseInt(questionidstring[1]) + 1;
		  			console.log(`questionidvalue` + questionidvalue);
  				}

				var faq = {
			        author: logEmail,
			        name: logName,
			        title: req.body.questiontitle,
			        text: req.body.questiontext,
			        question_id: "question_" + questionidvalue,
			        comments: []
		   	 	}

				db.insertOne(`FAQS`, faq, function(result){
						res.redirect('/FAQ');
				});
		});
	});
})

app.get(`/deleteuser`, function(req, res){

	db.deleteOne(`users`, {email: logEmail});
	res.redirect(`/`);
})

app.get(`/deletepost`, function(req, res){

	db.deleteOne(`adoption_posts`, {post_id: req.query.post});

	res.redirect('/userpage');
})

app.get(`/deletequestion`, function(req, res){

	db.deleteOne(`FAQS`, {question_id: req.query.question});

	res.redirect('/userpage');
})

//partial code
// app.post('/submitcomment', function(req,res)
// {
// 	var question_id = req.query.question_id
// 	db.updateOne('FAQS', {question_id: question_id}, {$set})
// })

app.get(`/indivFAQ`, function(req, res)
{
  	db.findOne('FAQ', {email: logEmail}, function(result)
  	{
  		var question = 
  		{
  			name: result.name,
			title: result.title,
			text: result.text,
  		}

  		res.render('/indivFAQ', question);
  	});
})

app.get('/upvote', function(req, res){
	var post_id = req.query.postID;
	db.findOne('adoption_posts', {post_id: post_id}, function(result){
		db.updateOne(`adoption_posts`, {post_id: post_id}, {$set: {
			upvotes: result.upvotes + 1
		}});
		res.redirect('/browse');
	});
})

app.listen(port, hostname, function(){
	console.log(`Server running at: `);
	console.log(`http://` + hostname + ':' + port);
})

