SmartApps = (function (SmartApps, $, window) {
    "use strict";
    var blockchain = SmartApps.Blockchain;
    var tokenSmart = SmartApps.tokenSmart;
    var contractMarket;
    var login_wallet;
    let GAS = 300000; 
    var ContractAddress = blockchain.address();
    SmartApps.Market = {};
    SmartApps.Market.loadContracts = async () => {
        contractMarket = await blockchain.loadContractNFTMarket();
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

    SmartApps.Market.AllowTrade =  async () => {
        await contractMarket.enableSales(true).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }
    
    SmartApps.Market.sell =  async (tokenID, price, name, description) => {
        await contractMarket.sell(tokenID, price, ContractAddress.AddressContractSmartNFT, ContractAddress.AddressContractSmartToken).send({gas:GAS*2}).then(async (value)=>{
            if(value.transactionHash){
                await axios.post("/market/sell/"+login_wallet,{
                    tokenid : tokenID,
                    price : price,
                    hash : value.transactionHash,
                    name : name,
                    description : description,
                    money_contract : ContractAddress.AddressContractSmartToken,
                    nft_contract : ContractAddress.AddressContractSmartNFT
                }).then((data) => {
                    blockchain.notify(data.data);
                });
            }
        });
    }

    SmartApps.Market.getMySell =  async () => {
    }
    SmartApps.Market.getMarketList =  async () => {
        await contractMarket.getSales(1,ContractAddress.AddressContractSmartNFT).call().then((value) => {
            console.log(value);
        });
    }


    SmartApps.Market.cancelsell =  async (tokenID) => {
        await contractMarket.cancelSell(tokenID, ContractAddress.AddressContractSmartNFT).send({gas:GAS*2}).then(async (value)=>{
            if(value.transactionHash){
                await axios.post("/market/cancelsell/"+login_wallet,{
                    tokenid : tokenID,
                    nft_contract : ContractAddress.AddressContractSmartNFT
                }).then((data) => {
                    blockchain.notify(data.data);
                });
            }
        });
    }


    SmartApps.Market.buy =  async (tokenID) => {
        await contractMarket.buy(tokenID,ContractAddress.AddressContractSmartNFT, ContractAddress.AddressContractSmartToken).send({gas:GAS}).then((value)=>{
            console.log(value);
        });
    }

    SmartApps.Market.isSeller =  async () => {
        var smartnft = await blockchain.loadContractSmartnft();
        let isApprovedForAll = await smartnft.isApprovedForAll(ContractAddress.AddressContractNFTMarket,login_wallet).call();
        return isApprovedForAll;
    }

    SmartApps.Market.enableSell =  async () => {
        var smartnft = await blockchain.loadContractSmartnft();
        let isApprovedForAll = await smartnft.isApprovedForAll(ContractAddress.AddressContractNFTMarket,login_wallet).call();
        
        if(isApprovedForAll == false){
            await smartnft.setApprovalForAll(ContractAddress.AddressContractNFTMarket, true).send({gas:GAS}).then((value) => {
                console.log(value);
            });
        }else{
            blockchain.notify("Your ready seller account");
        }
    }

    SmartApps.Market.enableSell =  async () => {
    }


    SmartApps.Market.init =  async function(){
        await blockchain.init();
        await SmartApps.Market.loadContracts();
        await SmartApps.Market.getMarketList();
        let isSeller = SmartApps.Market.isSeller();

        if(isSeller == true){
            $(".enablesell").attr("href","#");
            $(".enablesell").text("Controller");
            
        }

        (async ()=>{
            await axios.post("/market/items/"+login_wallet).then((data) => {
                $("[data-myitem]").html(data.data);
            });
        });

        $(".loaditem").on("click", async function(){
            var preview = $("input.walletAddress").val();
            $("[data-myitem]").html('<h4 class="text-center">Loadding...</h4>');
            await axios.post("/market/items/"+login_wallet+"?preview="+preview).then((data) => {
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
            });
        });

        $(".enablesell").on("click", function(){
            SmartApps.Market.enableSell();
        });


        

        $("[data-market-buy]").on("click", function(){
            SmartApps.Market.buy();
        });
    }
    SmartApps.components.docReady.push(SmartApps.Market.init);
    return SmartApps;
})(SmartApps, jQuery, window);