const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const config = require('./../config');
const hostname = "http://localhost:5000";
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
module.exports = function(prefix , app) {
		
		const getItems = async (wallet) => {
			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let total = await contract.totalSupply().call();
	 		let balance = await contract.balanceOf(wallet).call();

	 		var obj = [];
    		for(var i=1; i<=total; i++) {
    			const owner = await contract.ownerOf(i).call();
    			/*
		        await contract.tokenOfOwnerByIndex(wallet, i).call().then(async (tokenID) => {
                	if(tokenID > 0){
                		await contract.paramsOf(i).call().then((value) => {
		                	console.log("ID :",tokenID,"Option : ",value)
		                });
                	}
                });
                */
                if(owner == wallet){
                	obj.push(i);
                }
		    }

		    var object = [];
		    for(var i=0; i<obj.length; i++) {
		    	let index = parseInt(obj[i])
		    	

		    	await contract.paramsOf(index).call().then(async (value) => {
		    		sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+index+"' LIMIT 1";
    				item = await db.dbQuery(sql, true);
    				console.log(item);
    				if(item == undefined){
    					
    				}
                	object.push({tokenId:index, quality: value.quality, generation : value.generation});
                });
		    }


		    return object;
    		
		}

		app.get(prefix, (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('market.json');
		 
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/token/:token", (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('market.json');
		 
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/wallet/:wallet", (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		  const dataMain = fsFile.readJSONFile('market.json');
		  var wallet = req.params.wallet;
		  getItems(wallet);

		 res.render(dataMain.public.market == true ? "market-wallet" : "coming",dataMain);
		});


}