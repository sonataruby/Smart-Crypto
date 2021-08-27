
SmartApps = (function (SmartApps, $, window) {
        "use strict";
        
    
    var contractFarm;
   
    var presenterAddress;
    var investorAddress;
    var login_wallet;
    let GAS = 300000; 
    var blockchain = SmartApps.Blockchain;
    var ContractAddress = blockchain.address();
    var token = SmartApps.tokenSmart;
    
    SmartApps.tokenFarm = {};
    
    SmartApps.tokenFarm.loadContracts = async () => {

                contractFarm = await blockchain.loadContractFarm();
                
                login_wallet = await blockchain.getLoginWallet();
            }
    SmartApps.tokenFarm.setup = async () => {
                
            }
    SmartApps.tokenFarm.allowance = async () => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }
                const gasPrice = await blockchain.getGasPrice();
                
                await token.loadContracts();
                await token.allowance(ContractAddress.AddressContractFarm,login_wallet).call().then((data) => {
                    console.log(data);
                });
            }
    SmartApps.tokenFarm.approve = async (amount) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }
                const gasPrice = await blockchain.getGasPrice();
                
                await token.loadContracts();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");
                await token.approve(ContractAddress.AddressContractFarm,depositAmount);
            }
    SmartApps.tokenFarm.balance = async () => {
                let balance = 0;
                await contractFarm.stakedBalanceOf(login_wallet).call().then((data) => {
                    console.log(data);
                });
            }
    SmartApps.tokenFarm.getid = async () => {
                let lastSessionId = 0;
                await contractFarm.lastSessionIds(ContractAddress.AddressContractSmartToken).call().then((value) => {
                    lastSessionId = value;
                });
                return lastSessionId;
            }
            
   SmartApps.tokenFarm.stakedBalance = async (session_id) => {
                let balance = 0;
                await contractFarm.stakedBalance(session_id).call().then((data) => {
                    balance = data / 10 ** 18;
                });
                return balance;
            }
    SmartApps.tokenFarm.session = async (session_id) => {

                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                await contractFarm.sessions(session_id).call().then(async (value) => {
                    console.log(value);
                });
            }
    SmartApps.tokenFarm.earned = async (session_id) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                await contractFarm.earned(session_id, login_wallet).call().then(async (value) => {
                    console.log(value);
                });
            }
    SmartApps.tokenFarm.pool = async (amount, session_id) => {
                
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }
                const gasPrice = await blockchain.getGasPrice();
                
                await token.loadContracts();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");
                let CheckAppreve = await token.approve(ContractAddress.AddressContractFarm,depositAmount);
                
                await contractFarm.deposit(session_id, depositAmount).send({from: login_wallet, gasPrice: gasPrice, gas: GAS}).then((value) => {
                    console.log(value);
                });
                
            }
    SmartApps.tokenFarm.createpool  = async (appove, amount, session_id) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                const gasPrice = await blockchain.getGasPrice();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");
                let appoveAmount = blockchain.toWei(appove.toString(),"ether");
                console.log("/farm/approve/"+login_wallet+"/"+appoveAmount+"/"+ContractAddress.AddressContractFarm);
                await axios.get("/farm/approve/"+login_wallet+"/"+appoveAmount+"/"+ContractAddress.AddressContractFarm).then(async (data) => {
                    if(data == true){
                        $('#FarmDesopit').modal('show');
                        
                    }else{
                        let CheckAppreve = await token.approve(ContractAddress.AddressContractFarm,appoveAmount);
                        $('#FarmDesopit').modal('show');
                    }
                });
                

    }
    SmartApps.tokenFarm.withdraw = async (session_id, amount) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                const gasPrice = await blockchain.getGasPrice();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");
                /*
                let s = await SmartApps.tokenFarm.getid(); 
                
                let sb = await SmartApps.tokenFarm.earned(s); 
                console.log("Check Session : ", s, " Blance : ",sb);
                */
                
                await contractFarm.withdraw(session_id, depositAmount).send({from: login_wallet, gasPrice: gasPrice, gas: GAS}).then(async (value) => {
                    console.log(value);
                    blockchain.notify("Confirm success<br>Hash : "+value.transactionHash);
                });
                
                
    }
    SmartApps.tokenFarm.confirm = async (amount, session_id) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.connect();
                }
                const gasPrice = await blockchain.getGasPrice();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");
                await contractFarm.deposit(session_id, depositAmount).send({from: login_wallet, gasPrice: gasPrice, gas: GAS}).then(async (value) => {
                   
                    if(value.status == false){
                        blockchain.notify("Confirm Error");
                    }else if(value.status == true){
                        blockchain.notify("Confirm success<br>Hash : "+value.transactionHash);
                        await axios.get("/farm/task/"+login_wallet+"/join/"+value.transactionHash+"/"+session_id);
                    }
                });
            }
    SmartApps.tokenFarm.claim = async (lastSessionId) => {

                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.connect();
                }
                
                const gasPrice = await blockchain.getGasPrice();
                await contractFarm.claim(lastSessionId).send({from: login_wallet, gasPrice: gasPrice, gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
    SmartApps.tokenFarm.claimNft = async (lastSessionId) => {

                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.connect();
                }
                
                const gasPrice = await blockchain.getGasPrice();
                await contractFarm.claimNft(lastSessionId).send({from: login_wallet, gasPrice: gasPrice, gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
            
    SmartApps.tokenFarm.Init = () => {

    }
    SmartApps.components.docReady.push(SmartApps.tokenFarm.Init);

 return SmartApps;
})(SmartApps, jQuery, window);