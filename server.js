const fs = require('fs');
const path = require("path");
const io   = require('socket.io')
const express = require("express");
const partials      = require('express-partials');
const EJSLayout = require('express-ejs-layouts');
const port = process.env.port;
const http=require('http');
const app = express(); // create express app
const server = http.createServer(app);
const ejs = require('ejs');
const session = require('express-session')

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

app.get("/", (req, res) => {
 app.set('layout', './home')
 const dataMain = readJSONFile('main.json');
 
 res.render("index",dataMain);
});

app.get("/staking", (req, res) => {
 app.set('layout', './pages');
 const dataMain = readJSONFile('main.json');
 dataMain.pages = { name : dataMain.staking.title, description : dataMain.staking.description};
 

 res.render("staking",dataMain);
});

app.get("/farm", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './pages');
 res.render("farm",dataMain);
});

app.get("/game", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './pages');
 res.render("game",dataMain);
});

app.get("/token", (req, res) => {
 const dataMain = readJSONFile('main.json');

 app.set('layout', './pages');
 res.render("token",dataMain);
});

//Login Meta
app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  // Request a message from the server
  if (req.metaAuth && req.metaAuth.challenge) {
    console.log(req.metaAuth.challenge[1]);
    res.send(req.metaAuth.challenge[1])
  }
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
  if (req.metaAuth && req.metaAuth.recovered) {
    // Signature matches the cache address/challenge
    // Authentication is valid, assign JWT, etc.
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
app.get("/api/ntf/:id", (req, res) => {
	res.header('Content-Type', 'application/json');
	const data = readJSONFile('ntf.json');
    
    res.send(JSON.stringify(data[req.params.id]));
    res.end( data );

});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on  5000");
});