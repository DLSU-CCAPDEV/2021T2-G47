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
					contact: "<input type = 'text' id = 'numberform' name = 'numberform' value = '" + result.contact + "' size = '58'>",
					salary: "<input type = 'text' id = 'moneyform' name = 'moneyform' value = '" + result.salary + "' size = '58'>",
					image: result.path
				}
			})
		})	
	},

	submitedit: function(req, res){
		console.log(`REQFILE = ` + req.file);

		var image;

		db.updateMany(`adoption_posts`, {poster_email: req.session.email}, {$set: {
			poster: req.body.usernameform
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

		if(req.file != undefined){
			db.updateOne(`users`, {email: req.session.email}, {$set: {
				image: req.file,
				path: req.file.filename
			}})
		}

		res.redirect('/userpage');
	}
}

module.exports = controller;

