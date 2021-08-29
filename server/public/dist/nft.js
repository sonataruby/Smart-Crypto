
SmartApps = (function (SmartApps, $, window) {
    "use strict";
    
    SmartApps.nft = {};
    SmartApps.nft.factory =  async() => {
    	var blockchain = SmartApps.Blockchain;
    	await blockchain.init();
    	var factory = await blockchain.loadContractNFTFactory();
    	var smartnft     = await blockchain.loadContractSmartnft();
    	var wallet = await blockchain.getLoginWallet();
    	var GAS = 3000000;
    	const addGenerator = async () => {
    		let isGen = await factory.isGenerator(wallet).call();
    		console.log(isGen);
    	}
    	const mintQuality = async () => {
    		await factory.mintQuality(wallet,0,4).send({gas:GAS}).then((value) => {
    			console.log(value);
    		});
    	}
    	const getNFT = async () => {
    		let balance = await smartnft.balanceOf(wallet).call();
    		for(var i=1; i<=balance; i++) {
		        let id = await smartnft.tokenOfOwnerByIndex(accounts[0], i);
		        console.log(`#${i} id: ${id}`);
		    }

    		console.log(balance);
    	}
    	getNFT();
    	
    	$("#mintQuality").on("click", function(){
    		mintQuality();
    	});
        $(".contractaddress").html('<div>Contract : '+blockchain.address().AddressContractNFTFactory+'</div><div><a class="btn btn-md btn-primary" target="_bank" href="https://bscscan.com/address/'+blockchain.address().AddressContractNFTFactory+'">Contract</a></div>');
    }

    SmartApps.components.docReady.push(SmartApps.nft.factory);

    return SmartApps;
})(SmartApps, jQuery, window);
