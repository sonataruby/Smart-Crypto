const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const hostname = "http://localhost:5000";
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
module.exports = function(prefix , app) {
	
	/*
	Farm
	*/
	const convert = function(n){
        var sign = +n < 0 ? "-" : "",
            toStr = n.toString();
        if (!/e/i.test(toStr)) {
            return n;
        }
        var [lead,decimal,pow] = n.toString()
            .replace(/^-/,"")
            .replace(/^([0-9]+)(e.*)/,"$1.$2")
            .split(/e|\./);
        return +pow < 0 
            ? sign + "0." + "0".repeat(Math.max(Math.abs(pow)-1 || 0, 0)) + lead + decimal
            : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow-decimal.length || 0, 0))) : (decimal.slice(0,+pow)+"."+decimal.slice(+pow)))
    }

	app.get(prefix, (req, res) => {
	 const dataMain = fsFile.readJSONFile('main.json');
	 app.set('layout', './layout/pages');
	 
	 res.render(dataMain.public.farm == true ? "farm" : "coming",dataMain);
	});

	app.get(prefix + "/info/:session_id/:wallet", async (req, res) => {

		app.set('layout', './layout/pages');
		var session_id = req.params.session_id;
		var wallet = req.params.wallet;
		let contract = await blockchain.loadFram();
		let address = await blockchain.loadAddress();

		var block = {};

		let stakedBalanceOf = await contract.stakedBalanceOf(session_id,wallet).call();
		block.deposit = blockchain.web3.utils.fromWei(stakedBalanceOf);

		let claimable = await contract.claimable(session_id,wallet).call();
		block.claimable = parseFloat(blockchain.web3.utils.fromWei(claimable)).toFixed(4);

		block.session_id = session_id;
		block.timeEnd = 0;
		block.min_amount = 100;
		await contract.sessions(session_id).call().then(async (value) => {
			console.log(value);
			//parseFloat(blockchain.eth.utils.fromWei(String(value.amount).toString()));
			let amount = parseFloat(blockchain.web3.utils.fromWei(value.amount));
			let totalReward = parseFloat(blockchain.web3.utils.fromWei(value.totalReward));
			let startTime = parseInt(value.startTime);
			let period = parseInt(value.period);
			let rewardUnit = totalReward/period;
			let annualUnits = 31556952;  // 1 year in seconds
			let annualReward = rewardUnit * annualUnits * 1;
			block.timeEnd = startTime + period;
			block.rate = annualReward;
			block.apr = parseFloat((annualReward/amount)*100).toFixed(2);
			block.amount = amount;
		});

		let sql = `SELECT * FROM farm_task WHERE log_id = '`+session_id+`' ORDER BY status,timestart DESC LIMIT 1`;
		var data = await db.dbQuery(sql,true);
		var dataMainConfig = fsFile.readJSONFile('main.json');
		dataMainConfig.items = data;
		dataMainConfig.block = block;

		res.render("farm-info",dataMainConfig);
	});

	app.get(prefix + "/item", async (req, res) => {
	  app.set('layout', './layout/nolayout');
	 
	  let sql = `SELECT * FROM farm_task WHERE status = '1' ORDER BY status,timestart DESC LIMIT 3`;
	  var dataMain = await db.dbQuery(sql);
	  
	  var dataMainConfig = fsFile.readJSONFile('main.json');
	  let startTime = Math.floor(new Date().getTime()/1000) + 30;

	 
	  dataMainConfig.items = dataMain;
	  
	  dataMainConfig.TimeChecked = startTime;
	  
	  res.render("farm-item",dataMainConfig);

	});

	app.get(prefix + "/approve/:wallet/:amout/:token", async (req, res) => {
		var wallet = req.params.wallet;
	    var amout = parseFloat(req.params.amout);
	    var token = req.params.token;

	    let sql = "SELECT SUM(amount) as total FROM user_approve WHERE wallet = '"+wallet+"' AND token_address='"+token+"'";
	    var data = await db.dbQuery(sql,true);

	    res.header('Content-Type', 'application/json');
	    var dataJson = '{"status": false}';
  
	    if(data == undefined || data == "" || data == null){
	    	res.status(200);
	    	dataJson = '{"status": false}';
	    }else{
	    	console.log("Calc Data : ",data.total, data);
	    	//res.status(200);
	    	if(data.total > amout){
	    		dataJson = '{"status": true}';
				
	    	}
	    	
	    }

	    res.status(200);
	    res.send(dataJson);
		res.end( dataJson );
	   
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
	    var data = await db.dbQuery(sql);
	    //console.log(data);
	    var dataMainConfig = fsFile.readJSONFile('main.json')
	    dataMainConfig.items = data;
	    res.render("farm-mypool",dataMainConfig);

	  }else if(target == "join"){
	    sql = "INSERT INTO `farm_user` (`wallet`, `amount`, `session_id`, `hash`) VALUES ('"+wallet+"', '"+amount+"', '"+session_id+"', '"+hash+"');"
	    await db.dbQuery(sql);
	    await axios.get("http://localhost:3000/farm/"+session_id+"/sync");
	  }
	});
}
