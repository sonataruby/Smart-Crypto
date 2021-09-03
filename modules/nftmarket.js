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
    				var readObject = {};

    				if(item == undefined){
    					readObject = await insert_items(index, value.quality, value.generation);

    				}else{
    					readObject = JSON.parse(item.data);

    				}
    				readObject.id = index;
    				readObject.attributes[0].value = value.quality;
    				readObject.attributes[1].value = value.generation;
                	object.push(readObject);
                });
		    }


		    return object;
    		
		}

		const insert_items = async (tokenID, quality, generation) =>{
			const data = {
			  "id" : tokenID,
		      "attributes": [{
		              "trait_type": "QUALITY",
		              "value": quality
		            },
		            {
		              "trait_type": "Generation",
		              "value": generation
		            },
		            {
		              "display_type": "boost_number",
		              "trait_type": "Power",
		              "value": 2000
		            },
		            {
		              "display_type": "boost_number",
		              "trait_type": "map_point",
		              "value": 130
		            }
		          ],
		      "description": "No Description",
		      "external_url": "https://cryptocar.cc/api/nft/"+tokenID,
		      "image": "https://cryptocar.cc/nfts/"+generation+".gif",
		      "name": "CFX 17",
		      "animation_url": "",
		      "youtube_url": "",
		      "facebook_url": "",
		      "tiwter_url": "",
		      "smart_url": ""
		    }
			sql = "INSERT INTO `nft_smart` SET tokenId='"+tokenID+"', data='"+JSON.stringify(data)+"'";
    		await db.dbQuery(sql, true);
    		return data;
		}

		app.get(prefix, (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('market.json');
		 dataMain.loadJS = ["market.js"];
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/main/:page", async (req, res) => {
			app.set('layout', config.layout.dir + "/nolayout");
			const dataMain = fsFile.readJSONFile('market.json');
			const sql = "SELECT * FROM `nftmarket`";
			const data = await db.dbQuery(sql);
			dataMain.items = data;
			res.render(dataMain.public.market == true ? "market-item" : "coming",dataMain);
		});


		app.get(prefix + "/token/:token", (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('market.json');
		 
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/account", async (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		  const dataMain = fsFile.readJSONFile('market.json');
		  dataMain.loadJS = ["market.js"];
		 res.render(dataMain.public.market == true ? "market-wallet" : "coming",dataMain);
		});


		app.post(prefix + "/items/:wallet", async (req, res) => {
			app.set('layout', config.layout.dir + "/nolayout");
			var wallet = req.params.wallet;

			const dataMain = fsFile.readJSONFile('market.json');
			var data = [];
			if(wallet.length > 40){
				data = await getItems(wallet);
			}
			
			dataMain.items = data;
			res.render(dataMain.public.market == true ? "market-my-item" : "coming",dataMain);
		});
		app.post(prefix + "/sell/:wallet", async (req, res) => {
			var wallet = req.params.wallet;
			var tokenID = req.body.tokenid;
			var price = req.body.price;
			var hash = req.body.hash;
			var name = req.body.name;
			var description = req.body.description;
			sql = "INSERT INTO `nftmarket` SET wallet='"+wallet+"', tokenId='"+tokenID+"', name='"+name+"', description='"+description+"', price='"+price+"'";
    		await db.dbQuery(sql, true);
		});
		


}