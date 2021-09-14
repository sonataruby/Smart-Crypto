const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const config = require('./../config');
const hostname = "http://localhost:5000";
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
const moment = require('moment');

module.exports = function(prefix , app) {
		
		

		const getOptions = (value, index, description)=>{
			var options = {};
			options.tokenId = index;
			options.Image = "https://cryptocar.cc/nfts/"+value.Models+"/"+(value.Lever > 0 ? value.Lever : "1")+".gif";
			options.CarName = value.CarName;
			options.Description = description;
			options.Models = value.Models;
			options.Lever = value.Lever;
			options.Power = value.Power;
			options.Exp = value.Exp;
			options.Speed = value.Speed;
			options.Acceleraction = value.Acceleraction;
			options.Handing = value.Handing;
			options.Nitro = value.Nitro;
			return options;
		}
		

		const getClassName = (id)=>{
			var dataJson = ["NORMAL","NORMAL","SPECIAL","RARE","EPIC","LEGENDARY"];
			return dataJson[id];
		}
		

		const InfoCarBuild = async (contract, InfoSell) => {
	    	let tokenID = InfoSell.tokenId;
	    	var dataObj = {};
	    	await contract.paramsOf(tokenID).call().then(async (value) => {
	                //console.log(value);
	               
	                
		                sql = "SELECT * FROM `nft_smart` WHERE nft_contract='"+InfoSell.nft+"' AND tokenId='"+tokenID+"' LIMIT 1";
	    				item = await db.dbQuery(sql, true);
	    				var description = "";

	    				if(item == undefined || item == "") {
	    					description = "";
	    					
	    				}else{
	    					 description = item.description;
	    				}
	    				

		                dataObj = {
		                	name : value.CarName,
		                	description : description,
		                	image : "https://cryptocar.cc/nfts/"+value.Models+"/"+(value.Lever > 0 ? value.Lever : "1") +".png",
		                	attributes : getOptions(value, tokenID, description),
		                	model : getClassName(value.Models),
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
		                
		            

	            });
	    	return dataObj;
	    }


	    const InfoExpBuild = async (contract, InfoSell) => {
	    	let tokenID = InfoSell.tokenId;
	    	var dataObj = {};
	    	await contract.paramsOf(tokenID).call().then(async (value) => {
	                //console.log(value);
	               
	                
		                sql = "SELECT * FROM `nft_smart` WHERE nft_contract='"+InfoSell.nft+"' AND tokenId='"+tokenID+"' LIMIT 1";
	    				item = await db.dbQuery(sql, true);
	    				var description = "";

	    				if(item == undefined || item == "") {
	    					description = "";
	    					
	    				}else{
	    					 description = item.description;
	    				}
	    				

		                dataObj = {
		                	name : value.exp+" EXP",
		                	description : description,
		                	image : "https://cryptocar.cc/nfts/exp/"+(value.id > 0 && value.id <= 5 ? value.id : "5")+".gif",
		                	
		                	model : "",
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
		                
		            

	            });
	    	return dataObj;
	    }


		const getItemsMarkets = async (contractAddress) => {

			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let contractMarket = await blockchain.loadMarketNFT();
	 		let contractItem = await blockchain.loadNFTItem();
	 		let total = await contractMarket.getSalesAmount().call();

	 		var object = [];
	        for(var i=1; i<=total; i++) {
        	
	        	await contractMarket.getSales(i,contractAddress).call().then(async (value) => {
	        		if(value.tokenId > 0 && value.status == 0){
	        			
	        			if(contractAddress == address.AddressContractSmartNFT){
	        				let getInfo = await InfoCarBuild(contract, value);
	        				object.push(getInfo);
	        			}
	        			if(contractAddress == address.AddressContractNFTItem){
	        				let getInfo = await InfoExpBuild(contractItem, value);
	        				object.push(getInfo);
	        			}
	        			
	        			
	        		}
	        		
	        	});
	        }

	       
	       
	        return object;
    		
		}


		const getItemsMarketsInfo = async (contractAddress, tokenID) => {

			let contract = await blockchain.loadSmartNFT();
	 		let address = await blockchain.loadAddress();
	 		let contractMarket = await blockchain.loadMarketNFT();
	 		let contractItem = await blockchain.loadNFTItem();
	 		
	        var object = {};
	        await contractMarket.getSales(tokenID,contractAddress).call().then(async (value) => {

	        	if(value.nft == '0x3424cB5b1A48577Cd8022ae4383B72Ad6F1e33FE'){
					let getInfo = await InfoCarBuild(contract, value);
					object = getInfo;
				}else if(value.nft == '0x69865587e770053a2173BeD51b2F991b900222d1'){
					let getInfo = await InfoExpBuild(contractItem, value);
					object = getInfo;
					
				}
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
		      "image": "https://cryptocar.cc/nfts/"+model+"/"+lever+".png",
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
			var wallet = req.query.c;
			var items = [];
			var itemLayout = "market-item";
			if(wallet == dataMain.contractAddress.AddressContractSmartNFT || String(wallet).length < 40){
				items = await getItemsMarkets(dataMain.contractAddress.AddressContractSmartNFT);
			}
			if(wallet == dataMain.contractAddress.AddressContractNFTItem){
				items = await getItemsMarkets(dataMain.contractAddress.AddressContractNFTItem);
				itemLayout = "market/"+dataMain.contractAddress.AddressContractNFTItem;
			}
			
			dataMain.items = items;
			res.render(itemLayout,dataMain);
		});


		app.get(prefix + "/token/:token/:tokenid", async (req, res) => {
			var token = req.params.token;
			var tokenid = req.params.tokenid;
		  	app.set('layout', config.layout.dir + "/pages");
		 	const dataMain = fsFile.readJSONFile('market.json');
		 	dataMain.loadJS = ["market.js"];

		 	let infoItem = await getItemsMarketsInfo(token, tokenid);
		 	dataMain.item = infoItem;
		 	
		 	var itemLayout = "market-info";
			
		 	res.render(itemLayout,dataMain);

		});

		
		


}