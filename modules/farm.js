const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const config = require('./../config');
const hostname = "http://localhost:5000";
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
module.exports = function(prefix , app) {
	

	const loadInfoPool = async (session_id) => {
		let contract = await blockchain.loadFram();
	 	let address = await blockchain.loadAddress();
	 	var obj = {};
	 	obj.id = parseInt(session_id);
	 	let TimeNow = Math.floor(new Date().getTime()/1000) + 30;
	 	await contract.sessions(session_id).call().then(async (value) => {
	 		
	 		var LoadDB = await db.dbQuery("SELECT * FROM farm_task WHERE log_id='"+session_id+"'",true);
	 		
	 		var amount = parseFloat(blockchain.web3.utils.fromWei(value.amount == 0 ? value.totalReward : value.amount));
			var totalReward = parseFloat(blockchain.web3.utils.fromWei(value.totalReward));
			var mindeposit = value.minDeposit > 0 ? parseFloat(blockchain.web3.utils.fromWei(value.minDeposit)) : 0;
			var startTime = parseInt(value.startTime);
			var period = parseInt(value.period);
			var rewardUnit = totalReward/period;

			var annualReward = rewardUnit * 31556952;//1 year
			var annualRewardDay = rewardUnit * 86400;//1 Day
			var annualRewardWeek = rewardUnit * 604800;//1 week
			var annualRewardMonth = rewardUnit * 2629743;//1 Month
			var timeEnd = startTime + period;
			var loadNFT = await contract.sessionsnft(session_id).call();
			loadNFT.minDeposit2 = parseFloat(blockchain.web3.utils.fromWei(loadNFT.minDeposit2));
			loadNFT.minDeposit = parseFloat(blockchain.web3.utils.fromWei(loadNFT.minDeposit));
			obj.reward_nft = loadNFT;

			obj.name = value.poolName;
			
			obj.min_deposit = mindeposit;
			obj.image = "assets/car/9144.jpg";
			obj.thumbnail = "assets/car/thumbnail.png";
			obj.color = "#0f0";
			obj.color2 = "red";
			if(LoadDB != "" && LoadDB != undefined){
				
				
				
				obj.thumbnail = LoadDB.thumbnail == "" || LoadDB.thumbnail == undefined ? "assets/car/thumbnail.png" : LoadDB.thumbnail;
				obj.image = LoadDB.image == "" || LoadDB.image == undefined ? "assets/car/9144.jpg" : LoadDB.image;
				obj.color = LoadDB.color == "" || LoadDB.color == undefined ? "#0f0" : LoadDB.color;
				obj.color2 = LoadDB.color2 == "" || LoadDB.color2 == undefined ? "red" : LoadDB.color2;
			}

			obj.startTime = startTime;
			obj.timeEnd = timeEnd;

			obj.period = period;
			obj.rewardDay = annualRewardDay;
			obj.rewardWeek = annualRewardWeek;
			obj.rewardMonth = annualRewardMonth;
			obj.rewardYear = annualReward;
			obj.aprday = parseFloat((annualRewardDay/amount)*100).toFixed(2);
			obj.aprweek = parseFloat((annualRewardWeek/amount)*100).toFixed(2);
			obj.apr = parseFloat((annualReward/amount)*100).toFixed(2);
			obj.amount = amount;
			obj.totalReward = totalReward;

			
			
			if(startTime < TimeNow && timeEnd > TimeNow){
				obj.joinPool = '<button class="btn btn-sm btn-info data-info" data-href="/farm/info/'+session_id+'">Join Pool</button>';
				obj.status = 1;
			}else if(startTime > TimeNow && timeEnd > TimeNow){
				obj.joinPool = '<b>Wait Time Start<b>';
				obj.status = 0;
			}else if(timeEnd < TimeNow){
				obj.status = -1;
				obj.joinPool = '<div class="btn-group btn-sm" role="group"><button type="button" data-web3="farmclaim" data-session="'+session_id+'" class="btn btn-sm btn-secondary">Claim</button><button type="button" data-web3="withdraw" data-session="'+session_id+'" class="btn btn-sm btn-secondary">Withdraw</button></div>';
			}

	 	});
	 	return obj;
	}


	app.get(prefix, async (req, res) => {
		 app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('main.json');

		 let contract = await blockchain.loadFram();
		 let address = await blockchain.loadAddress();
		 let lastSessionId = 0;

		 await contract.lastSessionIds(address.AddressContractSmartToken).call().then((value) => {
		 	lastSessionId = value;
		 });
		 
		 var object = [];
		 if(lastSessionId > 3){
		 	for (var i = lastSessionId; i > lastSessionId - 3; i--) {
		 		var data = await loadInfoPool(i);
		 		object.push(data);
		 	}
		 }else{
		 	for (var i = lastSessionId; i > 0; i--) {
		 		var data = await loadInfoPool(i);
		 		object.push(data);
		 	}
		 }

		 dataMain.items = object;
		 dataMain.loadJS = ["farm.js"];
		 res.render(config.layout.getPage("farm"),dataMain);
	});

	app.get(prefix + "/info/:session_id/:wallet", async (req, res) => {

		app.set('layout', config.layout.dir + "/pages");
		
		var session_id = req.params.session_id;
		var wallet = req.params.wallet;
		let contract = await blockchain.loadFram();
		let address = await blockchain.loadAddress();

		var dataMainConfig = fsFile.readJSONFile('main.json');
		//dataMainConfig.items = data;
		dataMainConfig.block = await loadInfoPool(session_id);

		dataMainConfig.block.deposit = 0;
		dataMainConfig.block.claimable = 0;

		if(wallet.length > 40){
			let stakedBalanceOf = await contract.stakedBalanceOf(session_id,wallet).call();
			dataMainConfig.block.deposit = blockchain.web3.utils.fromWei(stakedBalanceOf);
			let claimable = await contract.claimable(session_id,wallet).call();
			dataMainConfig.block.claimable = parseFloat(blockchain.web3.utils.fromWei(claimable)).toFixed(4);
			dataMainConfig.block.infoPool = await contract.sessions(session_id).call();
		}
		dataMainConfig.loadJS = ["farm.js"];
		res.render(config.layout.getPage("farm-info"),dataMainConfig);
	});

	app.get(prefix + "/item", async (req, res) => {
	  app.set('layout', config.layout.dir + "/nolayout");
	 
	  let sql = `SELECT * FROM farm_task WHERE status = '1' ORDER BY status,timestart DESC LIMIT 3`;
	  var dataMain = await db.dbQuery(sql);
	  
	  var dataMainConfig = fsFile.readJSONFile('main.json');
	  let startTime = Math.floor(new Date().getTime()/1000) + 30;

	 
	  dataMainConfig.items = dataMain;
	  
	  dataMainConfig.TimeChecked = startTime;
	  
	  res.render("farm-item",dataMainConfig);

	});


	/*Save Database User Join*/

	app.post(prefix + "/join", async (req, res) => {
		var wallet = req.body.wallet;
		var session_id = req.body.session_id;
		let sql = "SELECT * FROM farm_users WHERE wallet = '"+wallet+"' ORDER BY id DESC LIMIT 1";
	  	var dataMain = await db.dbQuery(sql, true);
	  	if(dataMain == "" || dataMain == undefined){
	  		sqlInsert = "INSERT INTO `farm_users` (`wallet`, `session_id`) VALUES ('"+wallet+"', '"+session_id+"');"
	  		db.dbQuery(sqlInsert);
	  	}
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
	  app.set('layout', config.layout.dir + "/nolayout");
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
