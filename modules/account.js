const axios = require('axios').default;
const fsFile = require('./../fsFile');
const db = require('./../server/db');
const config = require('./../config');
const blockchain = require('./../server/blockchain');
let Web3 = require('web3');
const moment = require('moment');
const express = require('express');
const path = require("path");
const ejs = require('ejs');
const app = express();
app.set('views', path.join(__dirname, '/../apps'))
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

var router = express.Router();

	const prefix = "/account";

	const getModelName = (id)=>{
			var dataJson = ["NORMAL","NORMAL","SPECIAL","RARE","EPIC","LEGENDARY"];
			return dataJson[id];
	}
	const getLeverInfo = async (limit) => {
        let contract = await blockchain.loadSmartNFT();
        var obj = [];
        for (var i = 1; i <= limit; i++) {
            await contract.LeverOf(i).call().then((value) => {
                obj.push(value);
            });
        }
        return obj;
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
	                	image : "https://cryptocar.cc/nfts/"+value.Models+"/"+(value.Lever > 0 ? value.Lever : "1")+".png",
	                	attributes : getOptions(value, tokenID, description),
	                	model : getModelName(value.Models),
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
	                	attributes : getOptions(value, tokenID, description),
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


    

	const getItemsMySell = async (wallet) => {

		let contract = await blockchain.loadSmartNFT();
		let contractItem = await blockchain.loadNFTItem();
 		let address = await blockchain.loadAddress();
 		let contractMarket = await blockchain.loadMarketNFT();
 		let total = await contractMarket.getSalesAmount().call();
 		
        var object = [];
        for(var i=1; i<=total; i++) {
        	

        	await contractMarket.getSales(i,address.AddressContractSmartNFT).call().then(async (value) => {
        		if(value.tokenId > 0 && value.status == 0 && value.seller == wallet){
        			let getInfo = await InfoCarBuild(contract, value);
        			object.push(getInfo);
        		}
        		
        	});



        	await contractMarket.getSales(i,address.AddressContractNFTItem).call().then(async (value) => {
        		if(value.tokenId > 0 && value.status == 0 && value.seller == wallet){
        			
        			let getInfo = await InfoExpBuild(contractItem, value);
        			object.push(getInfo);
        		}
        		
        	});

        	/*
            const _owner = await contract.tokenByIndex(i-1).call();
	    	const owner = await contract.ownerOf(_owner).call();
            
            if(owner == address.AddressContractNFTMarket){
                obj.push(_owner);
            }
            */
        }

        

        
        return object;
		
	}


	const getMyItems = async (wallet) => {
			let contract = await blockchain.loadSmartNFT();
			
			
	 		let address = await blockchain.loadAddress();
	 		let total = await contract.totalSupply().call();
	 		let balance = await contract.balanceOf(wallet).call();

	 		var obj = [];
    		for(var i=1; i<=total; i++) {
    			const _owner = await contract.tokenByIndex(i-1).call();
		    	const owner = await contract.ownerOf(_owner).call();
                if(owner == wallet){
                	obj.push(_owner);
                }
		    }

		    
		    
		    var object = [];
		    for(var i=0; i<obj.length; i++) {
		    	let index = parseInt(obj[i])
		    	

		    	await contract.getOptions(index).call().then(async (value) => {
		    		var readObject = {};
		    		
		    		sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+index+"' LIMIT 1";
    				item = await db.dbQuery(sql, true);
    				var description = "";

    				if(item == undefined || item == "") {
    					description = "";
    					
    				}else{
    					 description = item.description;
    				}

    				readObject.image = "https://cryptocar.cc/nfts/"+value.Models+"/"+(value.Lever > 0 ? value.Lever : "1")+".gif";
    				readObject.id = index;
    				readObject.options = getOptions(value, index, description);
    				
    				
                	object.push(readObject);
                });
		    }

		    
		    return object;
    		
		}

		const getOptions = (value, index, description)=>{
			var options = {};
			options.tokenId = index;
			options.Image = "https://cryptocar.cc/nfts/"+value.Models+"/"+value.Lever+".gif";
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
		const getMyExp = async (wallet) => {
			
			let contractItem = await blockchain.loadNFTItem();
			
	 		let address = await blockchain.loadAddress();
	 		

		    let totalExp = await contractItem.totalSupply().call();
		    var objItem = [];
		    var objectExp = [];
		    
		    for(var i=1; i<=totalExp; i++) {
		    	const _owner = await contractItem.tokenByIndex(i-1).call();
		    	const owner = await contractItem.ownerOf(_owner).call();
		    	
    			if(owner == wallet){
                	objItem.push(_owner);
                }
            }
		    

		    
		    for(var i=0; i<objItem.length; i++) {
		    	let index = parseInt(objItem[i])
		    	await contractItem.paramsOf(index).call().then(async (value) => {
		    		var image = value.id;
		    		if(value.id == 0 || value.id > 5){
		    			image = 1;
		    		}
		    		if(value.id > 5) image = 5;
		    		objectExp.push({tokenId : index, image:"https://cryptocar.cc/nfts/exp/"+image+".png", exp : value.exp});
		    	});
		    }
		    
		   
		    return objectExp;
    		
		}
		

	router.get(prefix, (req, res) => {
		 const dataMain = fsFile.readJSONFile('main.json');
		 app.set('layout', config.layout.dir + "/account");
		 dataMain.loadJS = ["jquery-ui.js","market.js"];
		 res.render("account/index",dataMain);
	});

	router.get(prefix + "/cars", async (req, res) => {
		app.set('layout', config.layout.dir + "/account");
		const dataMain = fsFile.readJSONFile('main.json');
		dataMain.loadJS = ["jquery-ui.js","market.js"];
		res.render("account/index",dataMain);
	});
	router.post(prefix + "/cars", async (req, res) => {
		 const dataMain = fsFile.readJSONFile('main.json');
		 app.set('layout', config.layout.dir + "/nolayout");
		 var wallet = req.body.wallet;
		 
		 var itemCars = await getMyItems(wallet);
		 dataMain.items = itemCars;
		 var getLever = await getLeverInfo(5);
		 dataMain.getLever = getLever;

		 var itemExp = await getMyExp(wallet);
		 dataMain.getExp = itemExp;
		 dataMain.contract = dataMain.contractAddress.AddressContractSmartNFT;
		 res.render("account/cars",dataMain);
	});

	router.get(prefix + "/exp", async (req, res) => {
		app.set('layout', config.layout.dir + "/account");
		const dataMain = fsFile.readJSONFile('main.json');
		dataMain.loadJS = ["jquery-ui.js","market.js"];
		res.render("account/exp",dataMain);
	});

	router.post(prefix + "/exp", async (req, res) => {
		 const dataMain = fsFile.readJSONFile('main.json');
		 app.set('layout', config.layout.dir + "/nolayout");
		 var wallet = req.body.wallet;
		 var itemCars = await getMyExp(wallet);
		 dataMain.items = itemCars;
		 dataMain.contract = dataMain.contractAddress.AddressContractNFTItem;

		 res.render("account/exp-item",dataMain);
	});

	//Controller in markets
	router.get(prefix + "/store", async (req, res) => {
		app.set('layout', config.layout.dir + "/account");
		const dataMain = fsFile.readJSONFile('main.json');
		dataMain.loadJS = ["jquery-ui.js","market.js"];
		res.render("account/store",dataMain);
	});

	router.post(prefix + "/store", async (req, res) => {
		 const dataMain = fsFile.readJSONFile('main.json');
		 app.set('layout', config.layout.dir + "/nolayout");
		 var wallet = req.body.wallet;
		 var itemCars = await getItemsMySell(wallet);
		 dataMain.items = itemCars;
		 res.render("account/store-item",dataMain);
	});


app.use(router);

module.exports.app = app;