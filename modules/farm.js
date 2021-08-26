const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const hostname = "http://localhost:5000";
module.exports = function(prefix , app) {
	
	/*
	Farm
	*/
	app.get(prefix, (req, res) => {
	 const dataMain = fsFile.readJSONFile('main.json');
	 app.set('layout', './layout/pages');
	 
	 res.render(dataMain.public.farm == true ? "farm" : "coming",dataMain);
	});

	app.get(prefix + "/item", async (req, res) => {
	  app.set('layout', './layout/nolayout');
	  var dataMain = [];
	  await axios.get(hostname + '/farm/pool')
	    .then((response)=>{
	      dataMain = response.data;
	        
	      })
	    .catch((err)=>{
	      //console.log(err);
	    });
	  
	  var dataMainConfig = fsFile.readJSONFile('main.json');
	  let startTime = Math.floor(new Date().getTime()/1000) + 30;
	  dataMainConfig.items = dataMain;
	  dataMainConfig.TimeChecked = startTime;
	  
	  res.render("farm-item",dataMainConfig);

	});


	app.get(prefix + '/pool', async (req, res) => {
	  let con = await  db.getConnection();
	  let sql = `SELECT * FROM farm_task WHERE status = '1' ORDER BY status,timestart DESC LIMIT 3`;
	  var data = await db.dbQuery(con,sql);
	  res.header('Content-Type', 'application/json');
	  res.send(data);
	  res.end( data);
	  
	});


	app.get("/farm/task/:wallet/:target/:hash/:amount/:id", async (req, res) => {
	  app.set('layout', './layout/nolayout');
	  var wallet = req.params.wallet;
	  var target = req.params.target;
	  var hash   = req.params.hash;
	  var amount   = req.params.amount;
	  var session_id   = req.params.id;
	  let con = await  db.getConnection();

	  if(target == "list"){
	    let sql = "SELECT * FROM farm_user WHERE wallet = '"+wallet+"' ORDER BY session_id DESC LIMIT 100";
	    var data = await db.dbQuery(con, sql);
	    console.log(data);
	    var dataMainConfig = fsFile.readJSONFile('main.json')
	    dataMainConfig.items = JSON.parse(data);
	    res.render("farm-mypool",dataMainConfig);

	  }else if(target == "join"){
	    sql = "INSERT INTO `farm_user` (`wallet`, `amount`, `session_id`, `hash`) VALUES ('"+wallet+"', '"+amount+"', '"+session_id+"', '"+hash+"');"
	    await db.dbQuery(con, sql);
	    await axios.get("http://localhost:3000/farm/"+session_id+"/sync");
	  }
	});
}
