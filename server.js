const fs = require('fs');
const config = require('./config');
const db = require('./server/db');

const fsFile = require('./fsFile');
const path = require("path");
const _ = require("lodash");
//const io   = require('socket.io');
const hostname = "http://localhost:5000";

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



app.set('views', path.join(__dirname, '/apps'))
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
//app.use(partials());
app.use(EJSLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const homeLayout = () => {
  return config.layout.dir + "/home";
}
const pageLayout = () => {
  return config.layout.dir + "/pages";
}

const noLayout = () => {
  return config.layout.dir + "/nolayout";
}

//app.use("/test", test);

app.set('layout', pageLayout());


app.get("/", (req, res) => {
app.set('layout', homeLayout())
 const dataMain = fsFile.readJSONFile('main.json');
 
  dataMain.showPresell = req.query.join;
 
 res.render("index",dataMain);
});

require("./modules/ido")("/ido",app);
require("./modules/farm")("/farm",app);
require("./modules/airdrop")("/airdrop",app);





app.get("/staking", (req, res) => {
 const dataMain = fsFile.readJSONFile('main.json');
 
 res.render(dataMain.public.staking == true ? "staking" : "coming",dataMain);
});


app.get("/gallery", (req, res) => {
 
 const dataMain = fsFile.readJSONFile('main.json');
 dataMain.pages = { name : dataMain.staking.title, description : dataMain.staking.description};
 res.render("gallery",dataMain);
});




app.get("/market", (req, res) => {
 const dataMain = fsFile.readJSONFile('market.json');
 
 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
});



app.get("/game", (req, res) => {
 const dataMain = fsFile.readJSONFile('main.json');
 
 res.render(dataMain.public.game == true ? "game" : "coming",dataMain);
});

app.get("/token", (req, res) => {
 const dataMain = fsFile.readJSONFile('main.json');

 
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

app.get("/api/nft/:id", async (req, res) => {

    var id = req.params.id;
  	res.header('Content-Type', 'application/json');
    sql = "SELECT * FORM `nft_smart` WHERE tokenId='"+id+"');";
    let item = await db.dbQuery(sql, true);
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


var dbQuery = async function(databaseQuery) {
   
    let con = await  db.getConnection();
    let data = await db.dbQuery(con,databaseQuery);
    return data;
}



app.get('/query/:query/:wallet/:amount/:tokenaddress', async (req, res) => {
  var query = req.params.query;
  var wallet = req.params.wallet;
  var amount = parseFloat(req.params.amount / (10 ** 18));
  var tokenaddress = req.params.tokenaddress;
  var sql = null;
  if(query == "approve"){
    sqlcheck = "SELECT SUM(amount) as total FROM user_approve WHERE wallet = '"+wallet+"' AND token_address='"+tokenaddress+"'";
    var dataCheck = await db.dbQuery(sqlcheck,true);
    if(parseFloat(dataCheck.total) > 0){
      sql = "UPDATE `user_approve` SET `amount`='"+(parseFloat(dataCheck.total) + amount)+"' WHERE `wallet`='"+wallet+"' AND `token_address` = '"+tokenaddress+"';"
    }else{
      sql = "INSERT INTO `user_approve` (`wallet`, `amount`, `token_address`) VALUES ('"+wallet+"', '"+amount+"', '"+tokenaddress+"');"
    }
    
  }
  if(sql != null) await db.dbQuery(sql);
});

// start express server on port 5000
app.listen(config.db_config.port, () => {
  console.log("server started on  "+config.db_config.port);
  console.log("Layout  "+config.layout.dir);
  
});