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
        });
    }
    
    SmartApps.Market.sell =  async (tokenID, price, name, description) => {
        let depositAmount = blockchain.toWei(price.toString(),"ether");
        await contractMarket.sell(tokenID, depositAmount, ContractAddress.AddressContractSmartNFT, ContractAddress.AddressContractSmartToken).send({gas:GAS*2}).then(async (value)=>{
            if(value.transactionHash){

                let id = await blockchain.getNftTokenID(value.transactionHash);
                await axios.post("/market/sell/"+login_wallet,{
                    tokenid : tokenID,
                    sell_id : id,
                    price : price,
                    hash : value.transactionHash,
                    name : name,
                    description : description,
                    money_contract : ContractAddress.AddressContractSmartToken,
                    nft_contract : ContractAddress.AddressContractSmartNFT
                }).then((data) => {
                    
                });
                blockchain.notify(data.data);
                await loadMyController();
            }
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
            loadMyItem();
        });
    }
    SmartApps.Market.cancelsell =  async (tokenID) => {
        await contractMarket.cancelSell(tokenID, ContractAddress.AddressContractSmartNFT).send({gas:GAS}).then(async (value)=>{
            if(value.transactionHash){
                await axios.post("/market/cancelsell/"+login_wallet,{
                    tokenid : tokenID
                }).then((data) => {
                    blockchain.notify(data.data);
                    
                });
            }
        });
    }


    SmartApps.Market.buy =  async (tokenID, amount) => {
        
        await tokenSmart.loadContracts();
       // amount = amount + 50;
        let depositAmount = blockchain.toWei(amount.toString(),"ether");
        //let CheckAppreve = await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTMarket,depositAmount);
        //let appoveAmount = await tokenSmart.allowance(login_wallet,ContractAddress.AddressContractNFTMarket);

        let appoveAmount = await tokenSmart.allowance(ContractAddress.AddressContractNFTMarket);
       
        
        if(appoveAmount < amount){
            await tokenSmart.approve(ContractAddress.AddressContractNFTMarket,depositAmount).then(async() => {
                await contractMarket.buy(tokenID,ContractAddress.AddressContractSmartNFT, ContractAddress.AddressContractSmartToken).send({gas:GAS}).then( async (value)=>{
            
                    blockchain.notify("Your buy NFT complete");

                    if(window.TelegramChannel != "" && window.TelegramChannel != undefined){
                        await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                                chat_id: window.TelegramChannel,
                                text: `NFT Market sell complete\nTokenID : ${tokenID}\nPrice : ${amount} CAR\nHash : ${value.transactionHash}`,
                                parse_mode:'Markdown'
                        });
                        window.location.href="/market/account";
                    }
                });
            });
        }else{
            await contractMarket.buy(tokenID,ContractAddress.AddressContractSmartNFT, ContractAddress.AddressContractSmartToken).send({gas:GAS}).then( async (value)=>{
            
                blockchain.notify("Your buy NFT complete");
                if(window.TelegramChannel != "" && window.TelegramChannel != undefined){
                    await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                            chat_id: window.TelegramChannel,
                            text: `NFT Market sell complete\nTokenID : ${tokenID}\nPrice : ${amount} CAR\nHash : ${value.transactionHash}`,
                            parse_mode:'Markdown'
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

    SmartApps.Market.enableSell =  async () => {
        var smartnft = await blockchain.loadContractSmartnft();
        let isApprovedForAll = await smartnft.isApprovedForAll(login_wallet,ContractAddress.AddressContractNFTMarket).call();
        
        if(isApprovedForAll == false){
            await smartnft.setApprovalForAll(ContractAddress.AddressContractNFTMarket, true).send({gas:GAS}).then((value) => {
                console.log(value);
            });
        }else{
            blockchain.notify("Your ready seller account");
        }
    }

    


    const loadMyItem = async ()=>{
        $("[data-myitem]").html('<div class="preloader"><span class="spinner spinner-round"></span></div>');
        await axios.post("/market/myitem/"+login_wallet).then((data) => {
                $("[data-myitem]").html(data.data);

                $("[data-market-sell]").on("click", function(){
                    var tokenID = $(this).data("tokenid");
                    var price = $(this).parent().parent().find("input").val();
                    var name = $(this).parent().parent().parent().find("input.name").val();
                    var description = $(this).parent().parent().parent().find("textarea.description").val();
                    var error = false;
                    if(tokenID == 0){
                        blockchain.notify("Error Token ID, Plz Try again");
                        error = true;
                    }
                    if(price == 0){
                        blockchain.notify("Error Price, Plz Try again");
                        error = true;
                    }
                    if(error == false) SmartApps.Market.sell(tokenID, price, name, description);
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
                
            });
    }

    const loadMainItem = async (page)=>{
        $("[data-mainmarket]").html('<div class="preloader"><span class="spinner spinner-round"></span></div>');
        await axios.get("/market/main/"+page).then((data) => {
                $("[data-mainmarket]").html(data.data);
        });
    }

    const loadMyController = async () => {
            $("[data-myitem]").html('<div class="preloader"><span class="spinner spinner-round"></span></div>');
                await axios.post("/market/mysell/"+login_wallet).then((data) => {
                    $("[data-myitem]").html(data.data);
                    $("[data-market-cancelsell]").on("click",function (){
                        var tokenid = $(this).data("tokenid");
                        SmartApps.Market.cancelsell(tokenid);
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
            SmartApps.Market.buy(tokenID,amount);
        });
    }
    SmartApps.components.docReady.push(SmartApps.Market.init);
    return SmartApps;
})(SmartApps, jQuery, window);