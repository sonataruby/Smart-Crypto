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

	 		let balance = await contract.balanceOf(wallet).call();

	 		
    		for(var i=1; i<=balance; i++) {
		        let id = await contract.tokenOfOwnerByIndex(wallet, i);
		        await contract.tokenURI(id).call().then((data) => {
		        	console.log(data);
		        });
		    }

    		//console.log(balance);
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