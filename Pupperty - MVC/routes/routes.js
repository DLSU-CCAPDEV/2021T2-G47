const express = require(`express`);
const loginController = require(`../controllers/loginController.js`);
const signupController = require(`../controllers/signupController.js`);
const edituserController = require(`../controllers/edituserController.js`);
const userpageController = require(`../controllers/userpageController.js`);
const homepageController = require(`../controllers/homepageController.js`);
const browseController = require(`../controllers/browseController.js`);
const addpostController = require(`../controllers/addpostController.js`);
const adoptionController = require(`../controllers/adoptionController.js`);
const editpostController = require(`../controllers/editpostController.js`);
const editquestionController = require(`../controllers/editquestionController.js`);
const aboutpageController = require(`../controllers/aboutpageController.js`);
const faqController = require(`../controllers/faqController.js`);
const navbarController = require(`../controllers/navbarController.js`);

const app = express();
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, './public/uploads');
	},
	filename: function(req, file, callback){
		callback(null, new Date().getMonth() + "-" + new Date().getDate() + "-" + new Date().getFullYear() + "_" + new Date().getHours() + "-" + new Date().getMinutes() + "_" + file.originalname);
	}
})

const upload = multer({storage: storage});

//Login Controllers
app.get(`/`, loginController.getIndex);
app.post(`/loginCheck`, loginController.loginCheck);
app.post(`/login`, loginController.login);

//Sign-Up Controllers
app.get(`/signup`, signupController.openSignup);
app.post(`/register`, signupController.register);
app.post('/checkEmail', signupController.checkEmail);

//Edit User Controllers
app.get(`/edituser`, edituserController.edituser);
app.post(`/submitedit`, upload.single('image'), edituserController.submitedit);

//Userpage Controllers
app.get(`/userpage`, userpageController.userpage);
app.post(`/submitcertificate`,  upload.single('image'), userpageController.submitcertificate);
app.get(`/deleteuser`, userpageController.deleteuser);
app.get(`/deletepost`, userpageController.deletepost);
app.get(`/deletequestion`, userpageController.deletequestion);
app.get(`/editquestion`, userpageController.editquestion);
app.get(`/editpost`, userpageController.editpost);
app.get(`/checkpassword`, userpageController.checkpassword);

//Homepage Controllers
app.get(`/homepage`, homepageController.homepage);

//Browse Controllers
app.get(`/browse`, browseController.browse);
app.get(`/adoption`, browseController.adoption);
app.get(`/addpost`, browseController.addpost);
app.get('/upvote', browseController.upvote);
app.get('/profile', browseController.profile);

//Add Post Controllers
app.post(`/submitadoptionpost`, upload.single('image'), addpostController.submitadoptionpost);

//Adoption Controllers
app.get('/adoptdog', adoptionController.adoptdog);

//Edit Post Controllers
app.post(`/submiteditedpost`, upload.single('image'), editpostController.submiteditedpost);

//Edit Question Controllers
app.post(`/submiteditedquestion`, editquestionController.submiteditedquestion);

//About Page Controllers
app.get(`/aboutpage`, aboutpageController.aboutpage);

//FAQ Controllers
app.get(`/FAQ`, faqController.FAQ);
app.get(`/submitFAQ`, faqController.submitFAQ);
app.get(`/indivFAQ`, faqController.indivFAQ);
app.get(`/submitcomment`, faqController.submitcomment);
app.get('/checkuser', faqController.checkuser);

//Navbar Controllers
app.get(`/checksearch`, navbarController.checksearch);
app.get(`/logout`, navbarController.logout);

module.exports = app;