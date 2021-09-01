const fs = require('fs');
const db = require('./db');
const config = require("./../config");
const blockchain = require('./blockchain');
const moment = require('moment');

//blockchain.addAccount("b6afe8ee591312b8400726a6a2295fceb3c4138d5c1b25faf56f81e3acd1a830");

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
app.use(express.static(path.join(__dirname, '/public/dist')));
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
const Settings = require('./modules/settings');
const Nft = require('./modules/nft');
const Airdrop = require('./modules/airdrop');
const Presell = require('./modules/presell');
const dapp = require('./modules/dapp');

app.get("/settings", async (req, res) => {
    const dataMain = readJSONFile('main.json');
     dataMain.items = await Settings.findAll();
     res.render("settings",dataMain);
    
});

app.get("/farm", async (req, res) => {
 await Farm.init(blockchain);
 const dataMain = readJSONFile('main.json');
 dataMain.items = await Farm.findAll();
 var path = __dirname.replace("/server","/public/assets");
 const dir = "/game";
 const fileJson = fs.readdirSync(path + dir);
 dataMain.fileBG = fileJson;
 dataMain.filedir = "assets"+dir+"/";
 res.render("farm",dataMain);

});
app.get("/farm/:id/:target", async (req, res) => {
  await Farm.init(blockchain);
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
    
    var logid = req.body.session_id;
    var name = req.body.name;
    var nftreward = req.body.nftreward;
    var deposit = req.body.deposit;
    var image = req.body.image;
    var color = req.body.color;
    var color2 = req.body.color2;
    var totalReward = req.body.totalReward;

    var starttime_y = req.body.starttime_y;
    var starttime_m = req.body.starttime_m;
    var starttime_d = req.body.starttime_d;
    var starttime_h = req.body.starttime_h;
    var starttime_min = req.body.starttime_min;

    let startTime = Math.floor(new Date().getTime()/1000) + 30;
    var unixtime = moment(starttime_m+"/"+starttime_d+"/"+starttime_y+" "+starttime_h+":"+starttime_min+"", "M/D/YYYY H:mm").unix();
    if(parseInt(unixtime) < startTime) unixtime = startTime;
    const dataMain = readJSONFile('main.json');
    //await Farm.init(blockchain);
    await Farm.create({lastSessionId : session_id, name : name, nftreward: nftreward, deposit : deposit, image : image, color: color, color2 : color2});
    if(config.telegram.telegram.TelegramChannel != ""){
        await axios.post('https://api.telegram.org/bot'+config.telegram.telegram.token+'/sendMessage', {
                chat_id: config.telegram.telegram.TelegramChannel,
                text: `Game Farm Pool\nOpen new session\nReward ${totalReward} token\n You can join now ${dataMain.base}/farm`,
                parse_mode:'Markdown'
        });
    }
    res.redirect("/farm");
    
});

app.get("/nft", async (req, res) => {
    const dataMain = readJSONFile('main.json');
 //dataMain.items = await Farm.findAll();
    res.render("nft",dataMain);
});

app.get("/presell", async (req, res) => {
    const dataMain = readJSONFile('main.json');
 //dataMain.items = await Farm.findAll();
    res.render("presell",dataMain);
});

app.get("/airdrop", async (req, res) => {
    const dataMain = readJSONFile('main.json');
 //dataMain.items = await Farm.findAll();
    res.render("airdrop",dataMain);
});

app.get("/ido", async (req, res) => {
    const dataMain = readJSONFile('main.json');
 //dataMain.items = await Farm.findAll();
    res.render("ido",dataMain);
});



app.get("/dapp/airdrop", async (req, res) => {
    const dataMain = readJSONFile('main.json');
    var sql = "SELECT * FROM telegram_airdrop ORDER BY id DESC LIMIT 100";
    let data = await db.dbQuery(sql);
    dataMain.items = data;
    res.render("dapp/airdrop",dataMain);
});
app.get("/dapp/airdrop/send/:id", async (req, res) => {
    var id = req.params.id;
    var token = '1847718093:AAEwhuHi7PQ9vum_t4Jp1l9-Q4sbv1ssCOc';
    var channel = '@vsmartchannel';
    var sql = "SELECT * FROM telegram_airdrop WHERE id='"+id+"'";
    let data = await db.dbQuery(sql,true);
    var content = data.contents;
    content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '').replace(/<br[^>]*>/g, '\n');
    //content = content.replace(/ ?/g,'');
    //console.log(content);
    await axios.post('https://api.telegram.org/bot'+token+'/sendMessage', {
            chat_id: channel,
            text: `${content}`,
            parse_mode:'HTML'
    });
    res.redirect("/dapp/airdrop");

});
app.post("/dapp/airdrop", async (req, res) => {
    
    var name = req.body.name;
    var msg = req.body.code;
    msg = msg.replace(/\'/g, '');

    var sql = "INSERT INTO `telegram_airdrop` SET `name` = '"+name+"', `contents`='"+msg+"';";
    let data = await db.dbQuery(sql);
    //console.log(sql);
    res.redirect("/dapp/airdrop");
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

    const filecomponents = fs.readdirSync(path + "/apps/components");
    dataMain.components = filecomponents;

    const filelayout = fs.readdirSync(path + "/apps/layout");
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