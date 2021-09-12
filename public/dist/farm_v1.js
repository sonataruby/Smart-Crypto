
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
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }
                //ContractAddress = await blockchain.address();
                await token.loadContracts();
                await token.allowance(ContractAddress.AddressContractFarm);
            }
    SmartApps.tokenFarm.allowance = async () => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }
                await token.loadContracts();
                let amount = await token.allowance(ContractAddress.AddressContractFarm);
                return amount;
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
                
                await contractFarm.deposit(session_id, depositAmount).send({from: login_wallet, gasPrice: gasPrice, gas: GAS}).then( async (value) => {
                    if(window.TelegramChannel != "" && window.TelegramChannel != undefined){
                        await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                                chat_id: window.TelegramChannel,
                                text: `${login_wallet} Join FARM PO0L`,
                                parse_mode:'Markdown'
                        });
                    }
                });
                
            }
    SmartApps.tokenFarm.createpool  = async (amount, session_id) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                const gasPrice = await blockchain.getGasPrice();
                let depositAmount = blockchain.toWei(amount.toString(),"ether");

                let appoveAmount = await token.allowance(ContractAddress.AddressContractFarm);
               
                if(appoveAmount >= amount){
                    $('#FarmDesopit').modal('show');
                }else{
                    await token.approve(ContractAddress.AddressContractFarm,depositAmount).then(() => {
                        $('#FarmDesopit').modal('show');
                    });
                    
                }
                

    }
    SmartApps.tokenFarm.withdraw = async (session_id) => {
                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.init();
                }

                const gasPrice = await blockchain.getGasPrice();
                
               
                let balance = 0;
                await contractFarm.stakedBalanceOf(session_id,login_wallet).call().then( async (data) => {
                    if(data == 0){
                        blockchain.notify("You not join this pool");
                    }else{
                        let depositAmount = data.toString();

                        await contractFarm.withdraw(session_id, depositAmount).send({from: login_wallet, gasPrice: gasPrice, gas: GAS}).then(async (value) => {    
                            blockchain.notify("Confirm success<br>Hash : "+value.transactionHash);
                        });
                    }
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
                        if(window.TelegramChannel != "" && window.TelegramChannel != undefined){
                            await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                                    chat_id: window.TelegramChannel,
                                    text: `${login_wallet} Join FARM PO0L`,
                                    parse_mode:'Markdown'
                            });
                        }
                        //await axios.get("/farm/task/"+login_wallet+"/join/"+value.transactionHash+"/"+session_id);
                    }
                });
            }
    SmartApps.tokenFarm.claim = async (lastSessionId) => {

                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.connect();
                }
                
                const gasPrice = await blockchain.getGasPrice();
                await contractFarm.claimable(lastSessionId,login_wallet).call().then( async (data) => {
                    if(data == 0){
                        blockchain.notify("Balance empty. You can not claim");
                    }else{

                        await contractFarm.claim(lastSessionId).send({from: login_wallet, gasPrice: gasPrice, gas:GAS}).then(async (value) => {
                            blockchain.notify("Claim farm success<br>Hash : "+value.transactionHash);
                            if(window.TelegramChannel != "" && window.TelegramChannel != undefined){
                                await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                                        chat_id: window.TelegramChannel,
                                        text: `Farm earn : ${value.transactionHash}`,
                                        parse_mode:'Markdown'
                                });
                            }
                            
                        });
                    }
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
    
    SmartApps.tokenFarm.setNFT = async () => {

                let status = await blockchain.isStatus();
                if(status == false){
                    await blockchain.connect();
                }
                
                const gasPrice = await blockchain.getGasPrice();
                await contractFarm.setNftFactory(ContractAddress.AddressContractNFTFactory).send({from: login_wallet, gasPrice: gasPrice, gas:GAS}).then((value) => {
                    console.log(value);
                });
            }

    SmartApps.tokenFarm.Init = async () => {
            await blockchain.init();
            ContractAddress = await blockchain.address();
            var farm = SmartApps.tokenFarm;
            await farm.setup();
            
            await farm.loadContracts();
            let balance =  await SmartApps.tokenSmart.balance();
            //let id = await farm.getid();
            //let s = await farm.allowance();

           

              $(".data-info").on("click", async function(){
                
                
                if(login_wallet == "" || login_wallet == undefined){
                    blockchain.notify("Plz Login with Metamask or Trust Wallet");
                    return;
                }
                
                var url = $(this).attr("data-href");
                window.location.href= url + "/" + login_wallet;
              });

            $("[data-timestart]").each(function(res){
                var period = $(this).attr("data-period");
                var periodEx = parseInt(period);

                var timeStart = $(this).attr("data-timestart");

                var timeEnd = parseInt(timeStart) + parseInt(periodEx);
                $(this).find("span").html(moment.unix(timeStart).format('MMM D, YYYY, HH:mmA'));
                
                var CountFinish = moment.unix(timeEnd).format('YYYY/MM/DD HH:mm:ss');
                $(this).parent().find("[data-timeend]").html(CountFinish);

                var parentTabs = $(this).parent().find("[data-timeend]");
                var parentTabsT = $(this).parent().parent();

                parentTabs.countdown(CountFinish).on('update.countdown', function(event) {
                      var format = '%H:%M:%S';
                      if(event.offset.totalDays > 0) {
                        format = '%-d day%!d ' + format;
                      }
                      if(event.offset.weeks > 0) {
                        format = '%-w week%!w ' + format;
                      }
                      $(this).html(event.strftime(format));
                      parentTabsT.find(".claimOnly").remove();
                    })
                    .on('finish.countdown', function(event) {
                      $(this).html('<span class="text-primary text-wrap">'+CountFinish+'</span>').parent().addClass('disabled');
                        
                    });
            });

            $("[data-web3=farmpool]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    var amount = parseFloat($(this).attr("data-amount"));
                    //startSession();
                    farm.approve(amount,session_id);
                });
                $("[data-web3=farmdeposit]").on("click", function(){
                    var getAmout = $(this).parent().parent().find(".modal-body input").val();

                    var session_id = parseInt($(this).attr("data-session"));
                    var min_deposit = parseInt($(this).attr("data-min"));
                    var amount = parseFloat(getAmout);

                    let poolStake =  farm.stakedBalance(session_id);
                    
                    let error = false;
                    //startSession();

                    //Error when < Min Deposit
                    if(amount < min_deposit){
                        notify.toast("Min deposit : "+min_deposit);
                        error = true;
                    }

                    //Error when max poolSize
                    if( amount > poolStake){
                        notify.toast("Pool Allow deposit : "+poolStake);
                        error = true;
                    }

                    //Error When Balance not found
                    if(balance == 0 || balance < amount){
                        notify.toast("You Balance empty");
                        error = true;
                    }
                    //farm.earned(session_id);
                    //farm.session(session_id);
                    //farm.stakedBalance(session_id);
                    //console.log(session_id, " ", amount);
                    if(error == false){
                        farm.confirm(amount,session_id);
                    }
                    //farm.deposit(amount,session_id);
                });
                

                $("[data-web3=farmclaim]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    farm.claim(session_id);
                    return;
                });

                $("[data-web3=withdraw]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    farm.withdraw(session_id);
                    return;
                });

    }
    SmartApps.components.docReady.push(SmartApps.tokenFarm.Init);

 return SmartApps;
})(SmartApps, jQuery, window);

