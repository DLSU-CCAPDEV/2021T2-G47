const db = require(`../models/db.js`);

const controller = {

	submiteditedquestion: function(req, res){
		db.updateOne(`FAQS`, {question_id: req.body.question}, {$set: {
			title: req.body.title,
			text: req.body.text
		}}, function(result){
			res.redirect('/FAQ');
		});
	}
}

module.exports = controller;

