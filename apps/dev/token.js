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
                    
                    await axios.get("/query/approve/"+login_wallet+"/"+amount+"/"+wallet).then(()=>{
                        SmartApps.Blockchain.notify("Approve success. You can deposit start");
                    });
                });
            //}
            
        //});
        return true;
    };

    SmartApps.tokenSmart.send = async (to, amount) => {

    };

        
    
    //Controller.init();
    SmartApps.tokenSmart.Init = () => {

    };
    
    SmartApps.components.docReady.push(SmartApps.tokenSmart.Init);
    return SmartApps;
})(SmartApps, jQuery, window);