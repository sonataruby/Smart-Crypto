const fs = require('fs');
const db = require('./db');
const blockchain = require('./blockchain');
const moment = require('moment');

blockchain.addAccount("b6afe8ee591312b8400726a6a2295fceb3c4138d5c1b25faf56f81e3acd1a830");

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
  let jsonData = require(path.resolve(__dirname, "../json/"+filename));
  let jsonToken = require(path.resolve(__dirname, "../json/main.json"));
  let jsonMage = Object.assign({}, jsonToken, jsonData);
  //console.log(_.mergeWith(jsonToken, jsonData, jsonMage));
  return _.mergeWith(jsonToken, jsonData, jsonMage);
}
app.set('views', path.join(__dirname, '/public'))
//app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('layout', __dirname+'/public/layout.ejs');
//app.use(partials());
app.use(EJSLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


var dbQuery = async function(databaseQuery) {
    let con = await db.getConnection();
    return new Promise(data => {
        
        con.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                data('{"error": "404 page not found", "err_code": 404}');
            }
            try {
                

                data(result);

            } catch (error) {
                data('{"error": "404 page not found", "err_code": 404}');
            }

        });
    });

}

app.get("/", (req, res) => {
 
 const dataMain = readJSONFile('main.json');
 
 res.render("index",dataMain);
});

const Farm = require('./modules/farm');




app.get("/farm", async (req, res) => {
 await Farm.init(dbQuery, blockchain);
 const dataMain = readJSONFile('main.json');
 dataMain.items = await Farm.findAll();
 res.render("farm",dataMain);

});
app.get("/farm/:id/:target", async (req, res) => {
  await Farm.init(dbQuery, blockchain);
  var session_id = req.params.id;
  var target = req.params.target;
  console.log(target);
  if(target == "sync") await Farm.syncDB(session_id);
  if(target == "disable") await Farm.status(session_id,0);
  if(target == "enable") await Farm.status(session_id,1);
  res.redirect('/farm');
 
});

app.post("/farm/create", async (req, res) => {
    var name = req.body.name;
    
    var period = req.body.period;
    var reward = req.body.reward;
    var nftreward = req.body.nftreward;
    var deposit = req.body.deposit;
    var apr = req.body.apr;
    
    var starttime_y = req.body.starttime_y;
    var starttime_m = req.body.starttime_m;
    var starttime_d = req.body.starttime_d;
    var starttime_h = req.body.starttime_h;
    var starttime_min = req.body.starttime_min;

    let startTime = Math.floor(new Date().getTime()/1000) + 30;
    var unixtime = moment(starttime_m+"/"+starttime_d+"/"+starttime_y+" "+starttime_h+":"+starttime_min+"", "M/D/YYYY H:mm").unix();
    if(parseInt(unixtime) < startTime) unixtime = startTime;
    
    await Farm.init(dbQuery, blockchain);
    let lastSessionId = await Farm.create({name : name, period : period, reward : reward, nftreward: nftreward, deposit : deposit, startTime : unixtime, apr: apr});

    res.redirect("/farm/"+lastSessionId+"/sync");
    
});

app.get("/files", async (req, res) => {
    var path = __dirname.replace("/server","");
    var files = req.query.files;
    var fullFile = path + "/"+files;
    const dataMain = readJSONFile('main.json');
    dataMain.path = path;
    dataMain.files = files;
    dataMain.text = "";

    if(files != "" && files != undefined){
        dataMain.text = fs.readFileSync(fullFile);
    }
    

    const fileJson = fs.readdirSync(path + "/json");
    dataMain.filejson = fileJson;

    const filecomponents = fs.readdirSync(path + "/public/components");
    dataMain.components = filecomponents;

    const filelayout = fs.readdirSync(path + "/public/layout");
    dataMain.filelayout = filelayout;

    res.render("file-manager",dataMain);
});

app.post("/files", async (req, res) => {
    var name = req.body.name;
    var code = req.body.code;
    var path = __dirname.replace("/server","");
    var fullFile = path + "/"+name;
    fs.writeFileSync(fullFile, code);
    res.redirect("/files?files="+name);

});

/*Farm Controller*/
// start express server on port 5000
app.listen(3000, () => {
  console.log("server started on  3000");
});