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
    				readObject.attributes[0].value = value.quality;
    				readObject.attributes[1].value = value.generation;
                	object.push(readObject);
                });
		    }


		    return object;
    		
		}

		const insert_items = async (tokenID, quality, generation) =>{
			const data = {
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
		 
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/token/:token", (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		 const dataMain = fsFile.readJSONFile('market.json');
		 
		 res.render(dataMain.public.market == true ? "market" : "coming",dataMain);
		});

		app.get(prefix + "/wallet/:wallet", async (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		  const dataMain = fsFile.readJSONFile('market.json');
		  var wallet = req.params.wallet;
		  var data = await getItems(wallet);
		  dataMain.items = data;
		 res.render(dataMain.public.market == true ? "market-wallet" : "coming",dataMain);
		});


}