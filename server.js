const fs = require('fs');
const path = require("path");
//const io   = require('socket.io');

//const vhost = require('vhost');
const express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const axios = require('axios').default;

const partials      = require('express-partials');
const EJSLayout = require('express-ejs-layouts');
const port = process.env.port;
const http=require('http');
const app = express(); // create express app
const server = http.createServer(app);
const ejs = require('ejs');
const session = require('express-session')
const contract = require('truffle-contract');
const MetaAuth = require('meta-auth');
const metaAuth = new MetaAuth();

//const socket = io.listen(server);
function readJSONFile(filename) {
	let jsonData = require(path.resolve(__dirname, filename));
	return jsonData;
}
app.set('views', path.join(__dirname, '/public'))
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
//app.use(partials());
app.use(EJSLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
 app.set('layout', './layout/home')
 const dataMain = readJSONFile('main.json');
 
 res.render("index",dataMain);
});

app.get("/ido", (req, res) => {
 
 const dataMain = readJSONFile('main.json');
 
 app.set('layout', './layout/pages');
 res.render(dataMain.public.ido == true ? "ido" : "coming",dataMain);
});

app.get("/farm", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 res.render(dataMain.public.farm == true ? "farm" : "coming",dataMain);
});

app.get("/staking", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 res.render(dataMain.public.staking == true ? "staking" : "coming",dataMain);
});


app.get("/gallery", (req, res) => {
 app.set('layout', './layout/pages');
 const dataMain = readJSONFile('main.json');
 dataMain.pages = { name : dataMain.staking.title, description : dataMain.staking.description};
 res.render("gallery",dataMain);
});


app.get("/airdrop", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 dataMain.validateTelegram = 0;
 if(req.query.telegram != undefined && req.query.telegram != "" && req.query.telegram == "confirm") dataMain.validateTelegram = 1;
 res.render(dataMain.public.airdrop == true ? "airdrop" : "coming",dataMain);
});

app.get("/ntfmarket", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 res.render(dataMain.public.ntfmarket == true ? "ntfmarket" : "coming",dataMain);
});



app.get("/game", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 res.render(dataMain.public.game == true ? "game" : "coming",dataMain);
});

app.get("/token", (req, res) => {
 const dataMain = readJSONFile('main.json');

 app.set('layout', './layout/pages');
 res.render("token",dataMain);
});




//Login Meta
app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  // Request a message from the server
  if (req.metaAuth && req.metaAuth.challenge) {
    res.send(req.metaAuth.challenge[1])
  }
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
  if (req.metaAuth && req.metaAuth.recovered) {
    // Signature matches the cache address/challenge
    // Authentication is valid, assign JWT, etc.
    console.log(req.metaAuth.recovered);
    res.send(req.metaAuth.recovered);
  } else {
    // Sig did not match, invalid authentication
    res.status(400).send();
  };
});

/*
app.get('/api/:file', (req, res) => {

    fs.readFile( __dirname +'/api/' + req.params.file + ".json", 'utf8', function (err, data) {
        res.send(data);
        res.end( data );
    });

});
*/

app.get("/api/nft/:id", (req, res) => {

  	res.header('Content-Type', 'application/json');
  	const data = readJSONFile('ntf.json');
    var item = data[req.params.id];
    if(item == undefined) item = '{"error": "404 page not found", "err_code": 404}';
    res.send(item);
    res.end( item);
});

app.get("/api/nft/", (req, res) => {
  var data = '{"error": "404 page not found", "err_code": 404}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.get("/token/", (req, res) => {
   var data = '{"error": "404 page not found", "err_code": 404}';
    res.header('Content-Type', 'application/json');
    res.send(data);
    res.end( data );
});
// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on  5000");
});