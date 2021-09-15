SmartApps = (function (SmartApps, $, window) {
    "use strict";
    var blockchain = SmartApps.Blockchain;
    var tokenSmart = SmartApps.tokenSmart;
    var contractMarket;
    var contractToken;
    var login_wallet;
    let GAS = 300000; 
    var ContractAddress = blockchain.address();
    SmartApps.Market = {};
    SmartApps.Market.loadContracts = async () => {
        contractMarket = await blockchain.loadContractNFTMarket();
        //contractToken = await blockchain.loadContractSmart();
        login_wallet = await blockchain.getLoginWallet();
    }
    SmartApps.Market.action =  async () => {
        $(".sellitem").on("click", async function(){
        });
    }

    SmartApps.Market.addSupportedNft =  async (setTokenAddress) => {
        await contractMarket.addSupportedNft(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.removeSupportedNft =  async (setTokenAddress) => {
        await contractMarket.removeSupportedNft(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }


    SmartApps.Market.addSupportedCurrency =  async (setTokenAddress) => {
        await contractMarket.addSupportedCurrency(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.removeSupportedCurrency =  async (setTokenAddress) => {
        await contractMarket.removeSupportedCurrency(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.removeSupportedCurrency =  async (setTokenAddress) => {
        await contractMarket.removeSupportedCurrency(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.setFeeReceiver =  async (setTokenAddress) => {
        await contractMarket.setFeeReceiver(setTokenAddress).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.setFeeRate =  async (rate) => {
        await contractMarket.setFeeRate(rate).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.AllowTrade =  async () => {
        await contractMarket.enableSales(true).send({gas:GAS}).then((value)=>{
            console.log(value);
            window.location.reload();
        });
    }
    
    SmartApps.Market.sell =  async (tokenID, price, description, c_address) => {
        let depositAmount = blockchain.toWei(price.toString(),"ether");
        await contractMarket.sell(tokenID, depositAmount, c_address, ContractAddress.AddressContractSmartToken).send({gas:500000}).then(async (value)=>{
            if(value.transactionHash){

                let id = await blockchain.getNftTokenID(value.transactionHash);
                await axios.post("/market/sell/"+login_wallet,{
                    tokenid : tokenID,
                    sell_id : id,
                    price : price,
                    hash : value.transactionHash,
                    description : description,
                    money_contract : ContractAddress.AddressContractSmartToken,
                    nft_contract : c_address
                }).then((data) => {
                    blockchain.notify(data.data);
                });
                
                //await loadMyController();
               
            }
             window.location.reload();
        });
    }

    SmartApps.Market.getMySell =  async () => {
    }
    SmartApps.Market.getMarketList =  async () => {
        
    }

    SmartApps.Market.transfer = async (sendto, tokenID) => {
        var smartnft = await blockchain.loadContractSmartnft();
        smartnft.transferFrom(login_wallet,sendto,tokenID).send({gas:GAS}).then(async (value) =>{
            $('#transferWallet').modal('hide');
            blockchain.notify("Your transfer complete");
            window.location.reload();
        });
    }

     SmartApps.Market.transferExp = async (sendto, tokenID) => {
        var nftExp = await blockchain.loadContractNFTItem();
        nftExp.transferFrom(login_wallet,sendto,tokenID).send({gas:GAS}).then(async (value) =>{
            $('#transferWallet').modal('hide');
            blockchain.notify("Your transfer complete");
            window.location.reload();
        });
    }
    

    
    SmartApps.Market.AccessMintNFT = async () => {
        var nftFactory = await blockchain.loadContractNFTFactory();
        let isStaticUser = await nftFactory.isStaticUser(login_wallet).call();
        return isStaticUser;
    };
    

    SmartApps.Market.cancelsell =  async (tokenID,c_address) => {
        await contractMarket.cancelSell(tokenID, c_address).send({gas:GAS}).then(async (value)=>{
            if(value.transactionHash){
                await axios.post("/market/cancelsell/"+login_wallet,{
                    tokenid : tokenID
                }).then((data) => {
                    blockchain.notify(data.data);
                    
                });
                
            }
            window.location.reload();
        });
    }


    SmartApps.Market.buy =  async (tokenID, amount,c_address) => {
        
        await tokenSmart.loadContracts();
       // amount = amount + 50;
        let depositAmount = blockchain.toWei(amount.toString(),"ether");
        //let CheckAppreve = await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTMarket,depositAmount);
        //let appoveAmount = await tokenSmart.allowance(login_wallet,ContractAddress.AddressContractNFTMarket);

        let appoveAmount = await tokenSmart.allowance(ContractAddress.AddressContractNFTMarket);
       
        
        if(appoveAmount < depositAmount){
            await tokenSmart.approve(ContractAddress.AddressContractNFTMarket,depositAmount).then(async() => {
                await contractMarket.buy(tokenID,c_address, ContractAddress.AddressContractSmartToken).send({gas:GAS}).then( async (value)=>{
            
                    blockchain.notify("Your buy NFT complete");

                    if(window.TelegramServer != "" && window.TelegramServer != undefined){
                        await axios.post(window.TelegramServer, {
                                
                                text: `NFT Market sell complete\nTokenID : ${tokenID}\nPrice : ${amount} CAR\nHash : ${value.transactionHash}`
                        });
                        window.location.href="/market/account";
                    }
                });
            });
        }else{
            await contractMarket.buy(tokenID,c_address, ContractAddress.AddressContractSmartToken).send({gas:GAS}).then( async (value)=>{
            
                blockchain.notify("Your buy NFT complete");
                if(window.TelegramServer != "" && window.TelegramServer != undefined){
                    await axios.post(window.TelegramServer, {
                                
                                text: `NFT Market sell complete\nTokenID : ${tokenID}\nPrice : ${amount} CAR\nHash : ${value.transactionHash}`
                    });
                    window.location.href="/market/account";
                }
            });
        }
        
        
    }

    SmartApps.Market.isSeller =  async () => {
        var smartnft = await blockchain.loadContractSmartnft();
       
        var isApprovedForAll = await smartnft.isApprovedForAll(login_wallet,ContractAddress.AddressContractNFTMarket).call();
        return isApprovedForAll;
    }

    SmartApps.Market.enableSellCar =  async () => {
        var smartnft = await blockchain.loadContractSmartnft();
        let isApprovedForAll = await smartnft.isApprovedForAll(login_wallet,ContractAddress.AddressContractNFTMarket).call();
        
        if(isApprovedForAll == false){
            await smartnft.setApprovalForAll(ContractAddress.AddressContractNFTMarket, true).send({gas:GAS}).then((value) => {
                console.log(value);
                window.location.reload();
            });
        }else{
            return true;
        }
    }




    SmartApps.Market.UpCarsLever =  async (tokenid, itemid) => {
        var smartnft = await blockchain.loadContractSmartnft();
        var smartItem = await blockchain.loadContractNFTItem();
        let isApprovedForAll = await smartItem.isApprovedForAll(login_wallet,ContractAddress.AddressContractSmartNFT).call();
        
        if(isApprovedForAll == false){
            await smartItem.setApprovalForAll(ContractAddress.AddressContractSmartNFT, true).send({gas:GAS}).then(async (value) => {
                
                await smartnft.upLeverCar(tokenid, itemid).send({gas:500000}).then((value) => {
                    console.log(value);
                });
                window.location.reload();
            });
        }else{
            await smartnft.upLeverCar(tokenid, itemid).send({gas:500000}).then((value) => {
                console.log(value);
            });
            window.location.reload();
            
        }
    }

    SmartApps.Market.UpItemLever =  async (e1, e2) => {
        var smartnft = await blockchain.loadContractNFTItem();
        await smartnft.upLever(e1, e2).send({gas:400000}).then((value) => {
            console.log(value);
            window.location.reload();
        });
    }

    SmartApps.Market.isEnableSellExp =  async () => {
        var nftExp = await blockchain.loadContractNFTItem();
        let isApprovedForAll = await nftExp.isApprovedForAll(login_wallet,ContractAddress.AddressContractNFTMarket).call();
        return isApprovedForAll;
    };
    SmartApps.Market.enableSellExp =  async () => {
        var nftExp = await blockchain.loadContractNFTItem();
        let isApprovedForAll = await nftExp.isApprovedForAll(login_wallet,ContractAddress.AddressContractNFTMarket).call();
        
        if(isApprovedForAll == false){
            await nftExp.setApprovalForAll(ContractAddress.AddressContractNFTMarket, true).send({gas:GAS}).then((value) => {
                console.log(value);
                window.location.reload();
            });
        }else{
            return true;
        }
    }
    
    



    const loadMainItem = async (page)=>{
        $("[data-mainmarket]").html('<div class="preloader"><span class="spinner spinner-round"><h7 class="text-center">Loadding...</h7></span></div>');
        await axios.get("/market/main/"+page+"?c="+getURL("c")).then((data) => {
                $("[data-mainmarket]").html(data.data);
        });
    }

    

    const loadMyItemController = async (url)=>{
        $("div[data-account-item]").html('<div class="preloader"><span class="spinner spinner-round"></span></div>');
        await axios.post(url,{wallet : login_wallet}).then((data) => {
                $("div[data-account-item]").html(data.data);

                $("[data-market-sell]").on("click", async function(){
                    var tokenID = $(this).data("tokenid");
                    var c_address = $(this).data("contract");
                    var price = $(this).parent().parent().find("input.price").val();
                    if(c_address == ContractAddress.AddressContractNFTItem){
                        await SmartApps.Market.enableSellExp();
                    }
                    if(c_address == ContractAddress.AddressContractSmartNFT){
                        await SmartApps.Market.enableSellCar();
                    }
                    var description = $(this).parent().parent().find("textarea.description").val();
                    var error = false;
                    if(tokenID == 0){
                        blockchain.notify("Error Token ID, Plz Try again");
                        error = true;
                    }
                    if(price == 0){
                        blockchain.notify("Error Price, Plz Try again");
                        error = true;
                    }
                    if(error == false) SmartApps.Market.sell(tokenID, price, description, c_address);
                });
 
                $("[data-nft-transfer]").on("click", function(){
                    var tokenID = $(this).data("tokenid");
                    var sendto = $("#TransferNftWallet").val();
                    if(sendto.length < 40){
                        blockchain.notify("Error Wallet");
                        return false;
                    }
                    if(tokenID < 1){
                        blockchain.notify("Error Token ID");
                        return false;
                    }

                    SmartApps.Market.transfer(sendto,tokenID);
                });


                $("[data-exp-transfer]").on("click", function(){
                    var tokenID = $(this).data("tokenid");
                    var sendto = $("#TransferNftWallet").val();
                    if(sendto.length < 40){
                        blockchain.notify("Error Wallet");
                        return false;
                    }
                    if(tokenID < 1){
                        blockchain.notify("Error Token ID");
                        return false;
                    }

                    SmartApps.Market.transferExp(sendto,tokenID);
                });

                $("[data-carslever]").on("click", async function(){
                    var expid1 = parseInt($("#exptoken3 > img").data("tokenid"));
                    var tokenid = parseInt($("#carslibs2 > img").data("tokenid"));
                    if(expid1 == "" || expid1 == undefined || tokenid == "" || tokenid == undefined || isNaN(expid1) || isNaN(tokenid)){
                        blockchain.notify("Error Token ID EXP");
                        return false;
                    }
                    SmartApps.Market.UpCarsLever(tokenid,expid1);
                });

                $("[data-upexp]").on("click", async function(){
                    var expid1 = parseInt($("#exptoken1 > img").data("tokenid"));
                    var expid2 = parseInt($("#exptoken2 > img").data("tokenid"));
                    if(expid1 == expid2 || expid1 == "" || expid1 == undefined || expid2 == "" || expid2 == undefined || isNaN(expid1) || isNaN(expid2)){
                        blockchain.notify("Error Token ID EXP");
                        return false;
                    }
                    SmartApps.Market.UpItemLever(expid1,expid2);
                });

                $("[data-cancelsell]").on("click", async function(){
                    var tokenID = $(this).data("tokenid");
                    var c_address = $(this).data("contract");
                    SmartApps.Market.cancelsell(tokenID,c_address);
                });
                
            });
    }

    SmartApps.Market.init =  async function(){
        await blockchain.init();
        await tokenSmart.loadContracts();
        await SmartApps.Market.loadContracts();
        await SmartApps.Market.getMarketList();
        await tokenSmart.allowance(ContractAddress.AddressContractNFTMarket);
        //await SmartApps.Market.buy(1,100);
        let isSeller = await SmartApps.Market.isSeller();
        //let can_mint = await SmartApps.Market.AccessMintNFT();

       
        if($("div[data-account-item]").hasAttr("data-auto-load")){
            var url = $("div[data-account-item]").data('account-item');
            url = url.replace(/{wallet}/g,login_wallet);
            console.log(url);
            await loadMyItemController(url);
        }

        if($("[data-mint-nft]").length > 0){
            $("[data-mint-nft]").attr("href","/farm");
            $("[data-mint-nft]").html("Join S3 Game");
        }
        

        if(isSeller == true){
            $(".enablesell").attr("href","#");
            $(".enablesell").text("Controller");
            $(".enablesell").on("click", async ()=>{
                await loadMyController();
            });
        }else{
            $(".enablesell").on("click", function(){
                SmartApps.Market.enableSell();
            });
        }

        var loadMainDefault = async ()=>{

            var mainmarket = $("[data-mainmarket]");
            if(mainmarket.length > 0) {
                console.log("Load Main Market");
                await loadMainItem(1);
            }
            var myitem = $("[data-myitem]");
            if(myitem.length > 0) {
                await loadMyItem();
            }
            
        };
        

        await loadMainDefault();

        $(".loaditem").on("click", async function(){
            var preview = $("input.walletAddress").val();
            
            await loadMyItem();
        });

        
        $("[data-market-buy]").on("click", function(){
            var tokenID = $(this).data("tokenid");
            var amount = $(this).data("amount");
            var c_address = $(this).data("contract");
            SmartApps.Market.buy(tokenID,amount,c_address);
        });
    }
    SmartApps.components.docReady.push(SmartApps.Market.init);
    return SmartApps;
})(SmartApps, jQuery, window);