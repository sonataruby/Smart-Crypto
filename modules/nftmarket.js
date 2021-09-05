const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const config = require('./../config');
const hostname = "http://localhost:5000";
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
const moment = require('moment');

module.exports = function(prefix , app) {
		
		const getMyItems = async (wallet) => {
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


		const getItemsMySell = async (wallet) => {

			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let contractMarket = await blockchain.loadMarketNFT();
	 		let total = await contract.totalSupply().call();

	        var obj = [];
	        for(var i=1; i<=total; i++) {
	            const owner = await contract.ownerOf(i).call();
	            
	            if(owner == address.AddressContractNFTMarket){
	                obj.push(i);
	            }
	        }

	        var object = [];
	        for(var i=0; i<obj.length; i++) {
	            let tokenID = parseInt(obj[i])
	           
	            await contract.paramsOf(tokenID).call().then(async (value) => {
	                //console.log(value);
	                var InfoSell = await contractMarket.getSales(tokenID,address.AddressContractSmartNFT).call();
	                if(InfoSell.seller == wallet){
		                sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+tokenID+"' LIMIT 1";
	    				item = await db.dbQuery(sql, true);
	    				let jsonData = JSON.parse(item.data);
		                var dataObj = {
		                	name : item.name,
		                	description : item.description,
		                	image : jsonData.image,
		                	attributes : jsonData.attributes,
		                    buyer: InfoSell.buyer,
		                    currency: InfoSell.currency,
		                    id: InfoSell.id,
		                    length: InfoSell.length,
		                    nft: InfoSell.nft,
		                    price: InfoSell.price / 10**18,
		                    seller: InfoSell.seller,
		                    startTime: InfoSell.startTime,
		                    status: InfoSell.status,
		                    tokenId: InfoSell.tokenId
		                };
		                object.push(dataObj);
		            }

	            });
	        }

	        console.log(object);
	        return object;
    		
		}


		const getItemsMarkets = async () => {

			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let contractMarket = await blockchain.loadMarketNFT();
	 		let total = await contract.totalSupply().call();

	        var obj = [];
	        for(var i=1; i<=total; i++) {
	            const owner = await contract.ownerOf(i).call();
	            
	            if(owner == address.AddressContractNFTMarket){
	                obj.push(i);
	            }
	        }

	        var object = [];
	        for(var i=0; i<obj.length; i++) {
	            let tokenID = parseInt(obj[i])
	           
	            await contract.paramsOf(tokenID).call().then(async (value) => {
	                //console.log(value);
	                var InfoSell = await contractMarket.getSales(tokenID,address.AddressContractSmartNFT).call();
	                
		                sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+tokenID+"' LIMIT 1";
	    				item = await db.dbQuery(sql, true);
	    				let jsonData = JSON.parse(item.data);
		                var dataObj = {
		                	name : item.name,
		                	description : item.description,
		                	image : jsonData.image,
		                	attributes : jsonData.attributes,
		                    buyer: InfoSell.buyer,
		                    currency: InfoSell.currency,
		                    id: InfoSell.id,
		                    length: InfoSell.length,
		                    nft: InfoSell.nft,
		                    price: InfoSell.price / 10**18,
		                    seller: InfoSell.seller,
		                    startTime: moment.unix(InfoSell.startTime).format('MMM D, YYYY, HH:mm A'),
		                    status: InfoSell.status,
		                    tokenId: InfoSell.tokenId
		                };
		                object.push(dataObj);
		            

	            });
	        }

	        
	        return object;
    		
		}


		const getItemsMarketsInfo = async (tokenID) => {

			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let contractMarket = await blockchain.loadMarketNFT();
	 		

	        var object = {};
	        await contract.paramsOf(tokenID).call().then(async (value) => {
                //console.log(value);
                var InfoSell = await contractMarket.getSales(tokenID,address.AddressContractSmartNFT).call();
                
	                sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+tokenID+"' LIMIT 1";
    				item = await db.dbQuery(sql, true);
    				let jsonData = JSON.parse(item.data);
	                var dataObj = {
	                	name : item.name,
	                	description : item.description,
	                	image : jsonData.image,
	                	attributes : jsonData.attributes,
	                    buyer: InfoSell.buyer,
	                    currency: InfoSell.currency,
	                    id: InfoSell.id,
	                    length: InfoSell.length,
	                    nft: InfoSell.nft,
	                    price: InfoSell.price / 10**18,
	                    seller: InfoSell.seller,
	                    startTime: InfoSell.startTime,
	                    status: InfoSell.status,
	                    tokenId: InfoSell.tokenId
	                };
	                object = dataObj;
	            

            });

	        
	        return object;
    		
		}

		const insert_items = async (tokenID, model, lever) =>{
			const data = {
			  "id" : tokenID,
		      "attributes": [
		      		{
		              "trait_type": "Lever",
		              "value": lever
		            },
		      		{
		              "trait_type": "Model",
		              "value": model
		            }
		            
		          ],
		      "description": "No Description",
		      "external_url": "https://cryptocar.cc/api/nft/"+tokenID,
		      "image": "https://cryptocar.cc/nfts/"+lever+".png",
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
			const items = await getItemsMarkets();
			dataMain.items = items;
			res.render(dataMain.public.market == true ? "market-item" : "coming",dataMain);
		});


		app.get(prefix + "/token/:token/:tokenid", async (req, res) => {
			var token = req.params.token;
			var tokenid = req.params.tokenid;
		  	app.set('layout', config.layout.dir + "/pages");
		 	const dataMain = fsFile.readJSONFile('market.json');
		 	dataMain.loadJS = ["market.js"];

		 	let infoItem = await getItemsMarketsInfo(tokenid);
		 	dataMain.item = infoItem;
		 	res.render(dataMain.public.market == true ? "market-info" : "coming",dataMain);

		});

		app.get(prefix + "/account", async (req, res) => {
		  app.set('layout', config.layout.dir + "/pages");
		  const dataMain = fsFile.readJSONFile('market.json');
		  dataMain.loadJS = ["market.js"];
		 res.render(dataMain.public.market == true ? "market-wallet" : "coming",dataMain);
		});

		app.post(prefix + "/mysell/:wallet", async (req, res) => {
			app.set('layout', config.layout.dir + "/nolayout");
			var wallet = req.params.wallet;

			const dataMain = fsFile.readJSONFile('market.json');
			var data = [];
			if(wallet.length > 40){
				
				data = await getItemsMySell(wallet);
			}
			console.log(wallet);
			dataMain.items = data;
			res.render(dataMain.public.market == true ? "market-my-sell" : "coming",dataMain);
		});


		app.post(prefix + "/myitem/:wallet", async (req, res) => {
			app.set('layout', config.layout.dir + "/nolayout");
			var wallet = req.params.wallet;

			const dataMain = fsFile.readJSONFile('market.json');
			var data = [];
			if(wallet.length > 40){
				data = await getMyItems(wallet);
			}
			
			dataMain.items = data;
			res.render(dataMain.public.market == true ? "market-my-item" : "coming",dataMain);
		});

		app.post(prefix + "/sell/:wallet", async (req, res) => {
			var wallet = req.params.wallet;
			var tokenID = req.body.tokenid;
			
			var name = req.body.name;
			var description = req.body.description;
			
			let sqlcheck = "SELECT * FROM `nft_smart` WHERE tokenId='"+tokenID+"'";
			item = await db.dbQuery(sqlcheck, true);

			if(item != undefined){
				let jsonData = JSON.parse(item.data);
				jsonData.name = name;
				jsonData.description = description;

				let sql = "UPDATE `nft_smart` SET name='"+name+"', description='"+description+"', data='"+JSON.stringify(data)+"', sell_id='1' WHERE tokenId='"+tokenID+"'";
	    		await db.dbQuery(sql, true);
	    	}
		});

		app.post(prefix + "/cancelsell/:wallet", async (req, res) => {
			var wallet = req.params.wallet;
			var tokenID = req.body.tokenid;
			let sqlcheck = "SELECT * FROM `nft_smart` WHERE tokenId='"+tokenID+"'";
			item = await db.dbQuery(sqlcheck, true);
			if(item != undefined){
				let sql = "UPDATE `nft_smart` SET sell_id='0' WHERE tokenId='"+tokenID+"'";
	    		await db.dbQuery(sql, true);
	    	}
		});
		
		


}