const db = require(`../models/db.js`);

const controller = {

	FAQ: function(req, res){
		var q;

		  db.findMany('FAQS', null,
		  	{
		  		OPpath: 1,
		  		author: 1,
		  		name: 1,
		  		title:1, 
		  		text:1
		  	}, function(result){
		  		db.findOne(`users`, {email: req.session.email}, function(result2){
			  		 res.render('FAQ', {
			  		 	q: result,
			  		 	name: req.session.name,
			  		 	path: result2.path
			  		 });
			  	});
		  })
	},

	submitFAQ: function(req, res){

		var questionidstring;
		var questionidvalue;
		var tempComments = 
		{
			commentPath: "",
			name: "",
			commentText: ""
		}

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

	  				db.findOne('users', {email: req.session.email}, function(result3)
	  				{
	  					var faq = {
	  					OPpath: result3.path,
				        author: req.session.email,
				        name: req.session.name,
				        title: req.body.questiontitle,
				        text: req.body.questiontext,
				        question_id: "question_" + questionidvalue,
				        comments: tempComments
			   	 	}
				   	 	db.insertOne(`FAQS`, faq, function(result){
								res.redirect('/FAQ');
						});
	  				})
			});
		});
	},

	indivFAQ: function(req, res)
	{
	  	db.findOne('FAQ', {email: req.session.email}, function(result)
	  	{
	  		var question = 
	  		{
	  			OPpath: result.path,
	  			name: result.name,
				title: result.title,
				text: result.text,
	  		}
	  		res.render('/indivFAQ', question);
	  	});
	},

	submitcomment: function(req,res)
	{
		var question_id = req.query.question_id;
		db.findOne('FAQs', {question_id:question_id}, function(result)
		{
			db.updateOne('FAQs', {question_id:question_id}, 
				{ $set: {name:name} 
				})
		})
	}
}

module.exports = controller;

