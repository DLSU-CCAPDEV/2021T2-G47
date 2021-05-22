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
		  		text:1,
		  		question_id:1,
		  		comment: 1
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
		var commentObj = 
		{
			COPpath: "",
			comment_name: "",
			comment_text:"",
			status: "Submit Comment",
			answered: false
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
				        comment: commentObj
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
		var question_id = req.query.question_id;
	  	db.findOne('FAQS', {question_id:question_id}, function(result)
	  	{
	  	
	  		res.render('indivFAQ', 
	  			{
	  				path: result.OPpath,
		  			name: result.name,
					title: result.title,
					text: result.text
	  			}	
	  		);
	  	});
	},

	submitcomment: function(req,res)
	{
		var question_id = req.query.question_id;
		var comment = req.query.comment_content;

		db.findOne('users', {email: req.session.email}, function(result)
		{
			var commentObj = 
			{
				COPpath : result.path,
				comment_name: result.name,
				comment_text: comment,
				status: "Edit Comment",
				answered: true
			}
			console.log("Question ID: " + question_id);
			console.log("Comment: " + comment);
			console.log("Path: " + commentObj.COPpath);
			console.log("Comment Name: " + commentObj.comment_name);
			console.log("Comment Text: " + commentObj.comment_text);
 

			db.updateOne('FAQS', {question_id: question_id}, 
			{
				$set : {comment: commentObj}  
			});
		});

		res.redirect('/FAQ');
	}
}

module.exports = controller;
