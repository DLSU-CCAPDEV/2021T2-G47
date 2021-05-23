const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const fs = require(`fs`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const db = require('./models/db.js')
const hbs = require(`hbs`);
const routes = require(`./routes/routes.js`);
const session = require(`express-session`);

const app = express();

app.use(session({
    'secret': 'secret-key',
    'resave': false,
    'saveUninitialized': false,
}));

hbs.registerPartials(__dirname + '/views/partials');


app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(`/`, routes);

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

// limit an array to a maximum of elements (from the start)
hbs.registerHelper('limit', function (arr, limit) {
  if (!Array.isArray(arr)) { return []; }
  return arr.slice(0, limit);
})

hbs.registerHelper('reverseArray', (array) => array.reverse());	

app.listen(port, hostname, function(){
	console.log(`Server running at: `);
	console.log(`http://` + hostname + ':' + port);
})

