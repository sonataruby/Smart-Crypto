const fs = require('fs');
const db = require('./server/db');
let con;
let getCon = async function() {
  if (!con) {
    con = await db.getConnection();
  }
  
  return con;
}

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

//const socket = io.listen(server);
function readJSONFile(filename) {
	let jsonData = require(path.resolve(__dirname, "json/"+filename));
  let jsonToken = require(path.resolve(__dirname, "json/main.json"));
  let jsonMage = Object.assign({}, jsonToken, jsonData);
  //console.log(_.mergeWith(jsonToken, jsonData, jsonMage));
	return _.mergeWith(jsonToken, jsonData, jsonMage);
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


/*
Farm
*/
app.get("/farm", (req, res) => {
 const dataMain = readJSONFile('main.json');
 app.set('layout', './layout/pages');
 
 res.render(dataMain.public.farm == true ? "farm" : "coming",dataMain);
});

app.get("/farm/item", async (req, res) => {
  app.set('layout', './layout/nolayout');
  var dataMain = [];
  await axios.get(hostname + '/data/farm')
    .then((response)=>{
      dataMain = response.data;
        
      })
    .catch((err)=>{
      //console.log(err);
    });
  
  var dataMainConfig = readJSONFile('main.json');
  let startTime = Math.floor(new Date().getTime()/1000) + 30;
  dataMainConfig.items = dataMain;
  dataMainConfig.TimeChecked = startTime;
  
  res.render("farm-item",dataMainConfig);
});
app.get("/farm/task/:wallet/:target/:hash/:amount/:id", async (req, res) => {
  app.set('layout', './layout/nolayout');
  var wallet = req.params.wallet;
  var target = req.params.target;
  var hash   = req.params.hash;
  var amount   = req.params.amount;
  var session_id   = req.params.id;
  if(target == "list"){
    let sql = "SELECT * FROM farm_user WHERE wallet = '"+wallet+"' ORDER BY session_id DESC LIMIT 100";
    var data = await dbQuery(sql);
    console.log(data);
  }else if(target == "join"){
    sql = "INSERT INTO `farm_user` (`wallet`, `amount`, `session_id`, `hash`) VALUES ('"+wallet+"', '"+amount+"', '"+session_id+"', '"+hash+"');"
    await dbQuery(sql);
    await axios.get("http://localhost:3000/farm/"+session_id+"/sync");
  }
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

app.get("/market", (req, res) => {
 const dataMain = readJSONFile('market.json');
 app.set('layout', './layout/pages');
 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
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


var dbQuery = async function(databaseQuery) {
    let con = await getCon();
    return new Promise(data => {
        
        con.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                data('{"error": "404 page not found", "err_code": 404}');
            }
            try {
                

                data(JSON.stringify(result));

            } catch (error) {
                data('{"error": "404 page not found", "err_code": 404}');
            }

        });
    });

}

app.get('/data/:any', async (req, res) => {

  let sql = `SELECT * FROM farm_task WHERE status = '1' ORDER BY status,timestart DESC LIMIT 100`;
  var data = await dbQuery(sql);
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data);
  
});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on  5000");
});