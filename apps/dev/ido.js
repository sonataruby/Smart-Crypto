SmartApps = (function (SmartApps, $, window) {
        "use strict";
        
    
    var contractIdo;
   
    var presenterAddress;
    var investorAddress;
    var login_wallet;
    let GAS = 300000; 
    let blockchain = SmartApps.Blockchain;
    var ContractAddress = blockchain.address();

    SmartApps.tokenIDO = {};
    
    SmartApps.tokenIDO.loadContracts = async () => {

        contractIdo = await blockchain.loadContractIDO();

        login_wallet = await blockchain.getLoginWallet();
    }

     SmartApps.tokenIDO.setup = async () => {
                presenterAddress = ContractAddress.MasterIDOWallet;
                investorAddress = login_wallet;
                let status = await blockchain.isStatus();

                if(status == true){
                    await contractIdo.investors(login_wallet).call().then((data) => {
                        presenterAddress = data.presenterAddress;
                        investorAddress = data.investorAddress;
                    });

                    $("#LinkRef").val(window.location.protocol+"//"+window.location.hostname+"/ido?ref="+login_wallet);
                }else{
                     $("#LinkRef").val(window.location.protocol+"//"+window.location.hostname+"/ido?ref=WalletAddress");
                }
                
    }

    SmartApps.tokenIDO.sendinfo = async () => {    
               

                await axios.get("https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&api_key=c0cc3568f034c2ab6eaf1e70a429b1aae1a6aa10187eabfd3849fa59eccc35e4").then((response)=>{
                      
                        let price_usd = response.data.USD;
                        contractIdo.getPrice().call().then(function(res){
                            var price_token_bnb = Number(1/res).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                        
                            if(price_usd > 0){
                                
                                price_token_bnb = (price_usd * price_token_bnb).toFixed(4) + " USD";
                                
                            }else{
                                price_token_bnb = price_token_bnb + " BNB";
                            }
                            $(".price").html(price_token_bnb);
                            $(".pricebnb").html(price_token_bnb);
                        });
                      }).catch((err)=>{
                      //console.log(err);
                    });
                
                contractIdo.getSubply().call().then(function(res){
                    $(".totalSub").html(Number(res).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

                });
                
                contractIdo.getTimeStart().call().then(function(res){
                    $(".timestart").html(moment.unix(res).format('MMM D, YYYY, HH:mmA'));
                });
                contractIdo.getTimeEnd().call().then(function(res){
                    $(".timeend").html(moment.unix(res).format('MMM D, YYYY, HH:mmA'));
                    $(".timeCoundown").html(moment.unix(res).format('YYYY/MM/DD HH:mm'));
                });

                contractIdo.getMinPay().call().then(function(res){
                    $(".minpay").html((res/100) + " BNB");
                });
                
                contractIdo.getReward().call().then(function(res){
                    $(".reward").html(Number(res / 10**18).toFixed(8));
                });
    }
    
    SmartApps.tokenIDO.buytoken = async (amount) => {
                    let status = await blockchain.isStatus();
                    if(status == false){
                        await blockchain.connect();
                    }
                    const vamount =  blockchain.toWei(amount.toString());
                    await contractIdo.buyToken(presenterAddress)
                    .send({from : login_wallet, value: vamount, gas : GAS})
                    .then(function (res) {
                        
                        blockchain.notify("Buy token successful Tx : "+res.transactionHash);
                    });
    }
    
    SmartApps.tokenIDO.claim = async () => {
                        let status = await blockchain.isStatus();
                        if(status == false){
                            await blockchain.connect();
                        }
                        
                        await contractIdo.claim(presenterAddress)
                        .send({from : login_wallet,gas : GAS})
                        .then(function (res) {
                            //console.log("Check ",res);
                            if(res.transactionHash){
                                blockchain.notify("Claim successful Tx : "+res.transactionHash);
                            }
                        });
    }

    SmartApps.tokenIDO.Init = () => {

    }
    SmartApps.components.docReady.push(SmartApps.tokenIDO.Init);

 return SmartApps;
})(SmartApps, jQuery, window);