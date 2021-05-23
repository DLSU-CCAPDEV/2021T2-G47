const db = require(`../models/db.js`);

const controller = {

	aboutpage: function(req, res){

		res.render(`AboutPage`);
	}
}

module.exports = controller;

