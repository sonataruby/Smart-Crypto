SmartApps = (function (SmartApps, $, window) {
    "use strict";
    var blockchain = SmartApps.Blockchain;
    var tokenSmart = SmartApps.tokenSmart;
    SmartApps.Web3 = {};
    SmartApps.Web3.LoadDta =  async function(){
        //$("#WEB3_CONNECT_MODAL_ID").remove();
        await blockchain.init();
        var wallet = await blockchain.getLoginWallet();
        var isStatus = await blockchain.isStatus();
        await tokenSmart.loadContracts();
        console.log("Client ",wallet);
        if(wallet == null || wallet == "" || wallet == undefined){
                    
            $("#walletAddress").parent().html('<span id="metaConnect">N Connect</span>' + '<em class="icon fas fa-angle-double-right"></em>');
            $("#metaConnect, .metaConnect").on("click", () => {
                blockchain.connect();
            });
        }else{
            let balance = await tokenSmart.balance();
            $("#walletAddress").parent().html('<span>'+wallet+ '</span>' + '<em class="icon  fas fa-angle-double-right"></em>');
            $(".walletaddress").html(wallet);
            $(".balance").html(balance);
        }

        $("[data-web3=addwatch]").on("click", function(){
            var TokenAddress = $(this).attr("data-address");
            var tokenSymbol = $(this).attr("data-symbol");
            var tokenDecimals = $(this).attr("data-dec");
            var tokenImage = $(this).attr("data-logo");

            var _url = window.location.protocol + "//" + window.location.hostname + "/assets/ico/favicon.ico";

            if(TokenAddress == undefined || TokenAddress == "")TokenAddress =  tokenSmart.address();
            if(tokenSymbol == undefined || tokenSymbol == "") tokenSymbol =  tokenSmart.symbol();
            if(tokenDecimals == undefined || tokenDecimals == "") tokenDecimals =  tokenSmart.decimals();
            if(tokenImage == undefined || tokenImage == "") tokenImage = _url;
            blockchain.addToken(TokenAddress, tokenSymbol, tokenDecimals, tokenImage);
        });

        var pathURI = window.location.pathname.split('/');
        const routerFocus = pathURI[1];

        /*
        PreSell
        */
        var tokenPresell = SmartApps.tokenPresell;
        await tokenPresell.loadContracts();
        
        $("#btnBuyToken, [data-web3=presell]").on("click", function(){
            tokenPresell.presell("0.1");
        });

        /*
        Airdrop Setup
        */
        
        if(routerFocus == "airdrop"){
            const airdrop = SmartApps.Airdrop;
            await airdrop.loadContracts();
            await airdrop.setup();

            $("[data-web3=airdrop]").on("click", function(){
                var token = $(this).attr("data-token");
                airdrop.airdrop(parseInt(token));
                
            });

            if($("body").hasClass("telegramConfirm")){
                
                var token = Math.floor(Math.random() * 100000000);

                if(token != "") airdrop.airdrop(parseInt(token));
               
            }
        }
        if(routerFocus == "ido"){
            var ido = SmartApps.tokenIDO;
            await ido.loadContracts();
            await ido.sendinfo();
            await ido.setup();
            $("[data-web3=ido]").on("click", function(){

                var value = $("#getAmountBNB").val();
                var dataV = $(this).attr("data-value");
                if(dataV > 0) value = dataV;
                
                if(value < 0.01){
                    $(".htmlerror").html("Min Value 0.01 BNB");
                    $("#getAmountBNB").focus();
                }else{
                    ido.buytoken(value);
                }
                return;
            });

            $("[data-web3=claim]").on("click", function(){
                ido.claim();
                return;
            });
        }
        if(routerFocus == "farm"){
            var farm = SmartApps.tokenFarm;
            await farm.loadContracts();
            await farm.setup();
            //let id = await farm.getid();
            //let s = await farm.allowance();

            
            await axios.get("/farm/item").then((response)=>{


                $('[data-ejs-load]').html(response.data);

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
                    let balance =  tokenSmart.balance();
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
                });
            });
            
            $("[data-ejs-task]").load("/farm/task/"+wallet+"/list/0x/0/0", function(data){
                
                $("[data-web3=farmclaimpool]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    farm.claim(session_id);
                });
                
                $("[data-web3=farmclaimpoolnft]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    farm.claimNft(session_id);
                });
                

                $("[data-web3=farmwithdraw]").on("click", function(){
                    var session_id = parseInt($(this).attr("data-session"));
                    var amount = parseInt($(this).attr("data-amount"));
                    farm.withdraw(session_id, amount);
                });
            });
        }
         if(routerFocus == "staking"){
            alert(routerFocus);
         }
        
    }
    SmartApps.components.docReady.push(SmartApps.Web3.LoadDta);
    return SmartApps;
})(SmartApps, jQuery, window);