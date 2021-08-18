SmartApps = (function (SmartApps, $, window) {
    "use strict";
    //var $web3 = window.Web3Modal;
    SmartApps.Web3 = {};
    SmartApps.Web3.Pool = function(){

    	//var caddress = "0x4D4e02a7bd99B69fB8d349632a73b7a852A99aa4";
		
    	const Web3Modal = window.Web3Modal.default;
		const WalletConnectProvider = window.WalletConnectProvider.default;
		const Fortmatic = window.Fortmatic;
		const evmChains = window.evmChains;
		const GAS = 500000;
		const GAS_PRICE = "20000000000";
		var providerOptions = {
    
			  };
		let web3Spf;
		let provider;
		let contract;
		var isConnect = false;
		var isSwitchChain = false;

		var loadJSON = function(filename) {   

		    var xobj = new XMLHttpRequest();
		        xobj.overrideMimeType("application/json");
		    xobj.open('GET', "/abi/"+filename, true); // Replace 'my_data' with the path to your file
		    xobj.onreadystatechange = function () {
		          if (xobj.readyState == 4 && xobj.status == "200") {
		            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
		            //callback(xobj.responseText);
		             xobj.send(xobj.responseText);  
		          }
		    };
		    xobj.send(null);  
		}
		var getabi = async function(filename) {
		    // Parse JSON string into object
		   return $.getJSON("/abi/"+filename);
		   
		}

    	var init = async function(){
    		if(location.protocol !== 'https:') {
    			//Security
    		}
			  web3Spf = new Web3Modal({
			  	network: "binance",
			    cacheProvider: false, // optional
			    providerOptions, // required
			    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
			  });
    	}

    	var connect = async function(){
    		init();
    		
    		
			try {
			    provider = await web3Spf.connect();
			    isConnect = true;
			} catch(e) {
			    console.log("Could not get a wallet connection", e);
			    return;
			}

			provider.on("accountsChanged", (wallet) => {
			    if(wallet.length > 40) {
			    	refreshAccountData();
			    }else{
			    	disconnect();
			    	return;
			    }
			});

			
			  // Subscribe to chainId change
			provider.on("chainChanged", (chainId) => {
			    refreshAccountData();
			});

			provider.on("networkChanged", (networkId) => {
			     refreshAccountData();
			});
			provider.on("connect", (info) => {
			  if(info.chainId == 0x61){
				  isSwitchChain = true;
			  }
			});
			provider.on("disconnect", (code, error) => {
				//	console.log("disconnect : "+code);
			  if(error.code == 1013){
			  	 isConnect = false;
			  }
			  disconnect();
			  return;
			});

			await refreshAccountData();

    	}
    	var setConnect = async function(address, chain){
    		$.get('/auth/' + address, (res) =>   {
    			setCookie("wallet",address);
    		});
    		if(address == null || address == ""){
    			$("#walletAddress").parent().html('<span>Connect</span>' + '<em class="icon fas fa-angle-double-right"></em>');
    		}else{
    			$("#walletAddress").parent().html('<span>'+address+ '</span>' + '<em class="icon  fas fa-angle-double-right"></em>');
    		}
    		
    		
    	}

    	var disconnect = async function(){
    		init();
    		try {
			    provider = await web3Spf.connect();
			} catch(e) {
			    console.log("Could not get a wallet connection", e);
			    return;
			}
    		$("#walletAddress").html("Wallet");
    		if(provider.close) {
			    await provider.close();
			    await web3Spf.clearCachedProvider();
			    provider = null;
			  }
    	}

    	var refreshAccountData = async function(){
    		contract = new Web3(provider);

  			const chainId = await contract.eth.getChainId();
			  // Load chain information over an HTTP API
			  const chainData = evmChains.getChain(chainId);
			  const chainName = chainData.chain;
			  const network = chainData.network;
			  //document.querySelector("#network-name").textContent = chainData.name;
			  //$('#ModalWallet').removeClass("show");

			  $('#ModalWallet').modal("hide");
			  if(network == "mainnet"){
			  	
			  	const accounts = await contract.eth.getAccounts();
			  	if(chainName == "BSC"){
			  		
			  		if(accounts.length > 0) isConnect = true;
			  		return setConnect(accounts[0],chainData);
			  	}else{
			  		return disconnect();
			  	}

			  }else{
			  	const accounts = await contract.eth.getAccounts();

			  	if(chainName == "BSC"){
			  		
			  		return setConnect(accounts[0],chainData);
			  	}else{
			  		return disconnect();
			  	}
			  }
			  console.log(accounts);
			  
			 
    	}

    	var addToWallet = async function(TokenAddress, tokenSymbol, tokenDecimals, tokenImage){
    		// wasAdded is a boolean. Like any RPC method, an error may be thrown.
			  const wasAdded = await ethereum.request({
			    method: 'wallet_watchAsset',
			    params: {
			      type: 'ERC20', // Initially only supports ERC20, but eventually more!
			      options: {
			        address: TokenAddress, // The address that the token is at.
			        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
			        decimals: tokenDecimals, // The number of decimals in the token
			        image: tokenImage, // A string url of the token logo
			      },
			    },
			  });
    	}

    	var mint = async function(){

    	}

    	var buyIDO = async function(amount){
    		init();
    		var abi = await getabi("ido.json");
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abi,caddressIDO);
    		const accounts = await wseb3.eth.getAccounts();
    		const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		var refWallet = getCookie("ref") == null || getCookie("ref") == undefined ? MasterIDOWallet : getCookie("ref");
    		if(refWallet == accounts[0] || refWallet.length < 40) refWallet = MasterIDOWallet;
    		
    		contract.methods.buyToken(MasterIDOWallet)
		      .send({ from: accounts[0], value: vamount, gas : 300000})
		      .then(function (res) {
		        console.log(refWallet.length, "MINTED");
		        
		      });
    	}

    	var PreSell = async function(amount){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("presell.json");
    		var contract = new wseb3.eth.Contract(abi,caddressPresell);
    		const accounts = await wseb3.eth.getAccounts();
    		const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		//var refWallet = getCookie("ref") != null ? getCookie("ref") : accounts[0];
    		contract.methods.buyToken()
		      .send({ from: accounts[0], value: vamount, gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	var getBNBUSD = async function(){
    		var data_price = 0;
    		await $.getJSON('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&api_key=c0cc3568f034c2ab6eaf1e70a429b1aae1a6aa10187eabfd3849fa59eccc35e4',function( data ) {

    			data_price = data.USD;
    		});

    		return data_price;
    		
    	}
    	var timeConverter = function(UNIX_timestamp){
		  var a = new Date(UNIX_timestamp * 1000);
		  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var sec = a.getSeconds();
		  var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec ;
		  return time;
		}
    	var tokenInfo = async function(type){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("ido.json");
    		var contract = new wseb3.eth.Contract(abi,caddressIDO);
    		var price_usd = await getBNBUSD();
    		contract.methods.getPrice().call().then(function(res){
    			var price_token_bnb = Number(1/res).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    			
    			if(price_usd > 0){
    				
    				price_token_bnb = (price_usd * price_token_bnb).toFixed(4) + " USD";
    				
    			}else{
    				price_token_bnb = price_token_bnb + " BNB";
    			}
    			$(".price").html(price_token_bnb);
    			$(".pricebnb").html(price_token_bnb);
    			
    		});
    		if(type == "ido"){
	    		contract.methods.getSubply().call().then(function(res){
	    			$(".totalSub").html(Number(res).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

	    		});
	    		
	    		contract.methods.getTimeStart().call().then(function(res){
	    			$(".timestart").html(timeConverter(res));
	    		});
	    		contract.methods.getTimeEnd().call().then(function(res){
	    			$(".timeend").html(timeConverter(res));
	    		});

	    		contract.methods.getMinPay().call().then(function(res){
	    			$(".minpay").html((res/100) + " BNB");
	    		});
	    		
	    		contract.methods.getReward().call().then(function(res){
	    			$(".reward").html(Number(res / 10**18).toFixed(8));
	    		});
    		}
    	}

    	

    	var sell = async function(amount){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abi,caddress);
    		const accounts = await wseb3.eth.getAccounts();
    		//contract.methods.addMinter(accounts[0]);
    		contract.methods.mint(accounts[0],2)
		      .send({ from: accounts[0], data: "!minter2", amount: '0.001'})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}


    	var claimIDO = async function(){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("ido.json");
    		var contract = new wseb3.eth.Contract(abi,caddressIDO);
    		const accounts = await wseb3.eth.getAccounts();
    		//const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		var refWallet = getCookie("ref") == null || getCookie("ref") == undefined ? MasterIDOWallet : getCookie("ref");
    		if(refWallet == accounts[0] || refWallet.length < 40) refWallet = MasterIDOWallet;

    		contract.methods.claim(MasterIDOWallet)
		      .send({ from: accounts[0], gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	var Airdrop = async function(token){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("airdrop.json");
    		var contract = new wseb3.eth.Contract(abi,caddressAirdrop);
    		const accounts = await wseb3.eth.getAccounts();
    		//const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		//var refWallet = getCookie("ref") != null ? getCookie("ref") : accounts[0];
    		contract.methods.airdrop(token)
		      .send({ from: accounts[0], gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	var lpMining = async function(){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("farm.json");
    		var contract = new wseb3.eth.Contract(abi,caddressFarm);
    		const accounts = await wseb3.eth.getAccounts();
    	}

    	var nftStaking = async function(){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var abi = await getabi("staking.json");
    		var contract = new wseb3.eth.Contract(abi,caddressFarm);
    		const accounts = await wseb3.eth.getAccounts();

    		var deposit = function(){

    		}
    		var claim = function(){

    		}
    	}

    	var nftmarket = async function(){
    		var buy = function(){

    		}

    		var sell = function(){

    		}

    		var item = function(){

    		}
    	} 

    	var gamenft = function(){
    		var mint = function(){

    		}
    		var buyItem = function(){

    		}
    		var sellItem = function(){

    		}
    	}
    	$("#btnWalletConnect").on("click", function(){
    		connect();
    		//console.log($web3.default);
    		
    	});

    	$("#btnBuyToken, [data-web3=presell]").on("click", function(){
    		//if(provider == null) connect();
    		PreSell("0.1");
    		//console.log($web3.default);
    		
    	});
    	
    	$("[data-web3=ido]").on("click", function(){
    		var value = $("#getAmountBNB").val();
    		var dataV = $(this).attr("data-value");
    		if(dataV > 0) value = dataV;
    		
    		if(value < 0.01){
    			$(".htmlerror").html("Min Value 0.01 BNB");
    			$("#getAmountBNB").focus();
    		}else{
    			buyIDO(value);
    		}
    		
    	});

    	$("[data-web3=claim]").on("click", function(){
    		//if(provider == null) connect();
    		
    		claimIDO();
    		//console.log($web3.default);
    		
    	});

    	$("[data-web3=airdrop]").on("click", function(){
    		//if(provider == null) connect();
    		var token = $(this).attr("data-token");
    		Airdrop(parseInt(token));
    		//console.log($web3.default);
    		
    	});

    	if($("body").hasClass("telegramConfirm")){
    		//if(provider == null) connect();
    		var token = Math.floor(Math.random() * 100000000);

    		if(token != "") Airdrop(parseInt(token));
    		//console.log($web3.default);
    	}

    	$("[data-web3=addwatch]").on("click", function(){
    		var TokenAddress = $(this).attr("data-address");
    		var tokenSymbol = $(this).attr("data-symbol");
    		var tokenDecimals = $(this).attr("data-dec");
    		var tokenImage = $(this).attr("data-logo");
    		console.log(tokenImage);
    		addToWallet(TokenAddress, tokenSymbol, tokenDecimals, tokenImage);
    	});

    	// Staking
    	$("[data-staking=join]").on("click", function(){
    		var _period = window.period;
    		var _value = window.stakvalue;
    		
    		$('.toast').find(".toast-body").html("Min Value 100 Token");
    		$('.toast').addClass("toast-error");
    		$('.toast').toast('show');
    	});
    	$("[data-staking=claim]").on("click", function(){

    	});

    	$("[data-staking=withdraw]").on("click", function(){

    	});

    	//disconnect();
    	connect();
    	if($(".tokenInfo").html() != undefined){
	    	tokenInfo('ido');
	    }

	    if($(".airdropInfo").html() != undefined){
	    	tokenInfo('airdrop');
	    }
	    
	    
	    
    	//console.log(isConnect);
    	var ref = getUrlVars()["ref"];
    	if(ref != undefined){
	    	setCookie("ref",ref);
	    }
    	if(getCookie("wallet") != null){
    		$("#LinkRef").val(window.location.protocol+"//"+window.location.hostname+"/ido?ref="+getCookie("wallet"));
    	}

    };
    SmartApps.components.docReady.push(SmartApps.Web3.Pool);
	return SmartApps;
})(SmartApps, jQuery, window);
