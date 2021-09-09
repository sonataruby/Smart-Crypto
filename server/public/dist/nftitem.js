
SmartApps = (function (SmartApps, $, window) {
    "use strict";
    
    SmartApps.nft = {};
    SmartApps.nft.factory =  async() => {
    	var blockchain = SmartApps.Blockchain;
    	await blockchain.init();
    	var factory = await blockchain.loadContractNFTFactory();
    	var wallet = await blockchain.getLoginWallet();
        var item = await blockchain.loadContractNFTItem();
    	var GAS = 300000;

        const setStaticUser = async(setwallet) => {
            let isStaticUser = await factory.isStaticUser(setwallet).call();
            console(isStaticUser, " ", setwallet);
            if(isStaticUser == false){
                await factory.addStaticUser(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }

        
        let address = await blockchain.address().AddressContractNFTItem;
        console.log(address);
        await item.paramsOf(4).call().then((value) => {
            console.log(value);
        });
        //await item.createItem(2,500).send({gas:GAS});
        //await item.createItem(3,700).send({gas:GAS});
        //await item.createItem(4,1200).send({gas:GAS});
        //await item.upLeverItem(1,3).send({gas:GAS});
    }
    SmartApps.components.docReady.push(SmartApps.nft.factory);

    return SmartApps;
})(SmartApps, jQuery, window);