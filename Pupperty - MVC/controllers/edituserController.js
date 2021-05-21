const db = require(`../models/db.js`);

const controller = {

	edituser: function(req, res){
		var prev;

		db.findOne(`users`, {email: req.session.email}, function(result){

			console.log('final result = ' + result);
			console.log('FINAL req.session.email = ' + req.session.email);
			
			res.render(`edituserpage`, {
				prev: {
					name: "<input type = 'text' id = 'usernameform' name = 'usernameform' value = '" + result.name + "' size = '58'>",
					bio: result.bio,
					address: "<input type = 'text' id = 'addressform' name = 'addressform' value = '" + result.address + "' size = '58'>",
					contact: "<input type = 'number' id = 'numberform' name = 'numberform' value = '" + result.contact + "' size = '58'>",
					salary: "<input type = 'number' id = 'moneyform' name = 'moneyform' value = '" + result.salary + "' size = '58'>",
					image: result.path,
					bgpath: result.bgpath
				}
			})
		})	
	},

	submitedit: function(req, res){
		console.log(`REQFILE = ` + req.file);

		var image;
		var background;

		console.log(`SUBMITEDIT BG: ` + background + req.body.bg);

		switch(req.body.bg){
			case '1':
				background = "images/backgrounds/bg1.jpg";
				break;
			case '2':
				background = "images/backgrounds/bg2.jpg";
				break;
			case '3':
				background = "images/backgrounds/bg3.jpg";
				break;
			case '4':
				background = "images/backgrounds/bg4.jpg";
				break;
			case '5':
				background = "images/backgrounds/bg5.jpg";
				break;
			case '6':
				background = "images/backgrounds/bg6.jpg";
				break;
			case '7':
				background = "images/backgrounds/bg7.jpg";
				break;
			case '8':
				background = "images/backgrounds/bg8.jpg";
				break;
			case '9':
				background = "images/backgrounds/bg9.jpg";
				break;
		}

		db.updateMany(`adoption_posts`, {poster_email: req.session.email}, {$set: {
			poster: req.body.usernameform,
			poster_contact: req.body.numberform
		}})

		db.updateMany(`FAQS`, {author: req.session.email}, {$set: {
			name: req.body.usernameform
		}})

		db.updateOne(`users`, {email: req.session.email}, {$set: {
			name: req.body.usernameform,
			bio: req.body.bioform,
			address: req.body.addressform,
			contact: req.body.numberform,
			salary: req.body.moneyform,
			test: req.body.savechanges
		}})

		if(background != undefined){
			db.updateOne(`users`, {email: req.session.email}, {$set: {
				bgpath: background
			}})
		}

		if(req.file != undefined){
			db.updateOne(`users`, {email: req.session.email}, {$set: {
				image: req.file,
				path: req.file.filename
			}})

			db.updateMany(`adoption_posts`, {poster_email: req.session.email}, {$set: {
				poster_picture: req.file.filename
			}})
		}

		req.session.name = req.body.usernameform;

		res.redirect('/userpage');
	}
}

module.exports = controller;

