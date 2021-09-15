SmartApps = (function (SmartApps, $, window) {
    "use strict";    
    let contractAirdrop;
    var login_wallet;
    let GAS = 300000; 
    let blockchain = SmartApps.Blockchain;

    SmartApps.Airdrop = {};
    
    SmartApps.Airdrop.loadContracts = async () => {

            contractAirdrop = await blockchain.loadContractAirdrop();
            
            login_wallet = await blockchain.getLoginWallet();
    }

    SmartApps.Airdrop.setup = async () => {
            let status = await blockchain.isStatus();
            if(status == true){
                

                $("#LinkRef").val(window.location.protocol+"//"+window.location.hostname+"/ido?ref="+login_wallet);
            }else{
                $("#LinkRef").val(window.location.protocol+"//"+window.location.hostname+"/ido?ref=WalletAddress");
            }

            let contractIdo = await blockchain.loadContractIDO();
            await axios.get("https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&api_key=c0cc3568f034c2ab6eaf1e70a429b1aae1a6aa10187eabfd3849fa59eccc35e4").then((response)=>{
              
                let price_usd = response.data.USD;
                contractIdo.getPrice().call().then(function(res){
                    var price_token_bnb = Number(1/res).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    var price_bnb = Number(1/res).toFixed(8).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
                    if(price_usd > 0){
                        
                        price_token_bnb = (price_usd * price_token_bnb).toFixed(4) + " USD";
                        
                    }else{
                        price_token_bnb = price_token_bnb + " BNB";

                    }
                    $(".price").html(price_token_bnb);
                    $(".pricebnb").html(price_bnb/2);
                });
              }).catch((err)=>{
              //console.log(err);
            });
            
    }
    SmartApps.Airdrop.airdrop = async (token) => {
            let status = await blockchain.isStatus();
            if(status == false){
                await blockchain.connect();
            }
            var checkAirdrop = false;
            await contractAirdrop.claimed(login_wallet).call({from:login_wallet}).then((res) => {
                if(res == true) checkAirdrop = true;
            });

            if(checkAirdrop == true){
                blockchain.notify("Airdrop Ready");
            }else{
                await contractAirdrop.airdrop(token).send({from:login_wallet,gas : GAS}).then(async(res) => {
                    if(res.transactionHash){
                        blockchain.notify("Airdrop successful Tx : "+res.transactionHash);
                        if(window.TelegramServer != "" && window.TelegramServer != undefined){
                                await axios.post(window.TelegramServer, {
                                    text: `Airdrop Payment : ${res.transactionHash}`
                            });
                        }
                    }
                });
            }
        
    }

    SmartApps.Airdrop.Init = async () => {
        await blockchain.init();
        await SmartApps.Airdrop.loadContracts();
        await SmartApps.Airdrop.setup();

        $("[data-web3=airdrop]").on("click", function(){
            var token = $(this).attr("data-token");
            SmartApps.Airdrop.airdrop(parseInt(token));
            
        });

        if($("body").hasClass("telegramConfirm")){
            
            var token = Math.floor(Math.random() * 100000000);

            if(token != "") SmartApps.Airdrop.airdrop(parseInt(token));
           
        }
    }



    SmartApps.components.docReady.push(SmartApps.Airdrop.Init);

     return SmartApps;
})(SmartApps, jQuery, window);