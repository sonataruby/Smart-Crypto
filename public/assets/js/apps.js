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
			} catch(e) {
			    console.log("Could not get a wallet connection", e);
			    return;
			}

			provider.on("accountsChanged", (accounts) => {
			    refreshAccountData();
			});

			  // Subscribe to chainId change
			provider.on("chainChanged", (chainId) => {
			    refreshAccountData();
			});

			provider.on("networkChanged", (networkId) => {
			     refreshAccountData();
			});
			await refreshAccountData();

    	}
    	var setConnect = async function(address, chain){
    		$.get('/auth/' + address, (res) =>   {
    			setCookie("wallet",address);
    		});
    		$("#walletAddress").html(address);
    		
    	}

    	var disconnect = async function(){
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
			  		$("#walletAddress").html(accounts[0]);
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
			  
			 
    	}

    	var mint = async function(){

    	}

    	var buyIDO = async function(amount){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abiIDO,caddressIDO);
    		const accounts = await wseb3.eth.getAccounts();
    		const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		var refWallet = getCookie("ref") != null ? getCookie("ref") : accounts[0];
    		console.log(refWallet);
    		contract.methods.buyToken(refWallet)
		      .send({ from: accounts[0], value: vamount, gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	var PreSell = async function(amount){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abiPresell,caddressPresell);
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

    	var timeConverter = function(UNIX_timestamp){
		  var a = new Date(UNIX_timestamp * 1000);
		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var sec = a.getSeconds();
		  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		  return time;
		}
    	var tokenInfo = async function(){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abiIDO,caddressIDO);

    		contract.methods.getPrice().call().then(function(res){
    			$(".price").html(res);
    			$(".pricebnb").html(Number(1/res).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    		});

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
    			$(".reward").html(res);
    		});
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
    		var contract = new wseb3.eth.Contract(abiIDO,caddressIDO);
    		const accounts = await wseb3.eth.getAccounts();
    		//const vamount =  wseb3.utils.toWei(amount.toString());
    		//contract.methods.addMinter(accounts[0]);
    		var refWallet = getCookie("ref") != null ? getCookie("ref") : accounts[0];
    		console.log(refWallet);
    		contract.methods.claim(refWallet)
		      .send({ from: accounts[0], gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	var Airdrop = async function(token){
    		init();
    		provider = await web3Spf.connect();
    		var wseb3 = new Web3(provider);
    		var contract = new wseb3.eth.Contract(abiAirdrop,caddressAirdrop);
    		const accounts = await wseb3.eth.getAccounts();
    		const vamount =  wseb3.utils.toWei("0.0001");
    		//contract.methods.addMinter(accounts[0]);
    		//var refWallet = getCookie("ref") != null ? getCookie("ref") : accounts[0];
    		contract.methods.airdrop(token)
		      .send({ from: accounts[0], value: vamount, to : accounts[0], gas : 300000})
		      .then(function (res) {
		        console.log(res, "MINTED");
		        
		      });
    	}

    	$("#btnWalletConnect").on("click", function(){
    		connect();
    		//console.log($web3.default);
    		
    	});

    	$("#btnBuyToken, [data-web3=buytoken]").on("click", function(){
    		//if(provider == null) connect();
    		PreSell("0.01");
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
    	
    	connect();
    	tokenInfo();
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
