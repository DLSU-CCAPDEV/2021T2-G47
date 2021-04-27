const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const fs = require(`fs`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const db = require('./models/db.js')
const hbs = require(`hbs`);

hbs.registerPartials(__dirname + '/views/partials');

const app = express();
app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

var logName;

app.get(`/`, function(req, res){
	res.render(`Login`);
})

app.get(`/signup`, function(req, res){
	res.render(`Signup`);
})

app.get(`/homepage`, function(req, res){
	res.render(`HomePage`);
})

app.get(`/userpage`, function(req, res){
	res.render(`userpage`);
})

app.get(`/addpost`, function(req, res){
	res.render(`AddPost`);
})

app.get(`/adoption`, function(req, res){
	res.render(`Adoption`);
})

app.get(`/editpost`, function(req, res){
	res.render(`EditPost`);
})

app.get(`/editquestion`, function(req, res){
	res.render(`EditQuestion`);
})

app.get(`/edituser`, function(req, res){
	res.render(`edituserpage`);
})

app.get(`/FAQ`, function(req, res){
	res.render(`FAQ`);
})

app.get(`/browse`, function(req, res){
	res.render(`Browse`);
})

app.post(`/login`, function(req, res){
	// retrieve the data from the form / request
	var email = req.body.email;
	var password = req.body.password;

	var person = {
		email: email,
		password: password
	}

	// access the database, then save the data
	db.findOne(`users`, person, function(result){
		if(result == null){
			res.render(`Login`);
			console.log(result);
		}
		else{
			res.render(`HomePage`);
			console.log(result);
			logName = result.name;
			console.log(logName);
		}
	});
})

app.post(`/register`, function(req, res){

	var email = req.body.email;
	var password = req.body.password;

	var person = {
		email: email,
		password: password,
		name: "",
		bio: "",
		address: "",
		contact: "",
		salary: "",
		status: "Not Certified",
		certvalid: "",
		homeowner: [],
		rescuer: []
	}

	db.insertOne(`users`, person);

	res.render(`HomePage`);
})

app.post(`/submitadoptionpost`, function(req, res){

	var dog = {
		name: req.body.name,
		breed: req.body.breed,
		sex: req.body.sex,
		size: req.body.size,
		age: req.body.age,
		remarks: req.body.remarks
	}

	db.insertOne(`adoption_posts`, dog);

	res.render(`Browse`);
})

app.post(`/submitFAQ`, function(req, res){

	var faq = {
		title: req.body.questiontitle,
		text: req.body.questiontext
	}

	db.insertOne(`FAQS`, faq);

	res.render(`FAQ`);
})

app.listen(port, hostname, function(){
	console.log(`Server running at: `);
	console.log(`http://` + hostname + ':' + port);
})