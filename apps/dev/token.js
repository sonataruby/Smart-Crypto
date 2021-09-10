SmartApps = (function (SmartApps, $, window) {
    "use strict";    
    var contractToken;
    var login_wallet;
    let GAS = 300000; 
    let blockchain = SmartApps.Blockchain;
    SmartApps.tokenSmart = {};
    
        
    SmartApps.tokenSmart.loadContracts = async () => {

            contractToken = await blockchain.loadContractSmart();
            
            login_wallet = await blockchain.getLoginWallet();
            
        };
        

    SmartApps.tokenSmart.price = async () => {
        var price = 0;
        await contractToken.getPrice().call().then(function(value){
            price = value;
            
        });
        return price;
    };
    SmartApps.tokenSmart.balance = async () => {
        var balance = 0;
        await contractToken.balanceOf(login_wallet).call({ from: login_wallet }).then((value) => {
                balance = value / 10**18;
        });
        
        return balance.toFixed(2);
    };
    SmartApps.tokenSmart.address = async () => {
        return ContractAddress.AddressContractSmartToken;
    };
    SmartApps.tokenSmart.symbol = async () => {
        var symbol = 0;
        await contractToken.symbol().call().then((value) => {
                symbol = value;
        });
        return symbol;

    };
    SmartApps.tokenSmart.decimals = async () => {
        var decimals = 0;
        await contractToken.decimals().call().then((value) => {
                decimals = value;
        });
        return decimals;
    };
    SmartApps.tokenSmart.approve = async (wallet, amount) => {

        var status = await blockchain.isStatus();
        if(status == false){
            await blockchain.connect();
        }

        //let depositAmount = blockchain.web3.utils.toWei(amount.toString(),"ether");
        const gasPrice = await blockchain.getGasPrice();
        var approveGasEstimate = null;
        try {
            approveGasEstimate = await contractToken.approve(wallet, amount).estimateGas({ from: login_wallet });
        } catch (e) {
            console.log("Failed to count approvement!");
            console.error(e);
            return false;
        } 

       //await contractToken.allowance(wallet,login_wallet).call().then(async (value) => {
            
        //    if(value < amount){
                await contractToken.approve(wallet,amount).send({from: login_wallet, gasPrice: gasPrice, gas: approveGasEstimate * 3}).then(async (value) => {
                    
                    SmartApps.Blockchain.notify("Approve success. You can deposit start");
                });
            //}
            
        //});
        return true;
    };
    SmartApps.tokenSmart.allowance = async (contractAddress) => {
        var amount = 0;
        await contractToken.allowance(login_wallet, contractAddress).call().then(async (value) => {
            
            amount = await blockchain.fromWei(value);
           
        });
       
        return amount;
    };
    

    SmartApps.tokenSmart.send = async (to, amount) => {

    };
    SmartApps.tokenSmart.newAdmin = async () => {
        
        await contractToken.transferOwnership("0x85C720932A91687C931e9952fc26D393a1F3c2ff").send({gas:GAS}).then(async (value) => {
            console.log(value);

        });
    };
    
        
    
    //Controller.init();
    SmartApps.tokenSmart.Init = async () => {
        await blockchain.init();
        var wallet = await blockchain.getLoginWallet();
        var isStatus = await blockchain.isStatus();
        await SmartApps.tokenSmart.loadContracts();
        let balance =  SmartApps.tokenSmart.balance();

        if(wallet == null || wallet == "" || wallet == undefined){
                    
            $("#walletAddress").parent().html('<span id="metaConnect">N Connect</span> <em class="icon fas fa-angle-double-right"></em>');
            $("#metaConnect, .metaConnect").on("click", () => {
                blockchain.connect();
            });
        }else{
            let balance = await SmartApps.tokenSmart.balance();
            $("#walletAddress").parent().html('<span>'+wallet+ '</span>' + '<em class="icon  fas fa-angle-double-right"></em>');
            $("nav > .walletaddress, code.walletaddress").html(wallet);
            $(".balance").html(balance);
            $("input.walletAddress").val(wallet);
        }

        $("[data-web3=addwatch]").on("click", function(){
            var TokenAddress = $(this).attr("data-address");
            var tokenSymbol = $(this).attr("data-symbol");
            var tokenDecimals = $(this).attr("data-dec");
            var tokenImage = $(this).attr("data-logo");

            var _url = window.location.protocol + "//" + window.location.hostname + "/assets/ico/favicon.ico";

            if(TokenAddress == undefined || TokenAddress == "")TokenAddress =  SmartApps.tokenSmart.address();
            if(tokenSymbol == undefined || tokenSymbol == "") tokenSymbol =  SmartApps.tokenSmart.symbol();
            if(tokenDecimals == undefined || tokenDecimals == "") tokenDecimals =  SmartApps.tokenSmart.decimals();
            if(tokenImage == undefined || tokenImage == "") tokenImage = _url;
            blockchain.addToken(TokenAddress, tokenSymbol, tokenDecimals, tokenImage);
        });
    };
    
    SmartApps.components.docReady.push(SmartApps.tokenSmart.Init);
    return SmartApps;
})(SmartApps, jQuery, window);