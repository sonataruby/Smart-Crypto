
SmartApps = (function (SmartApps, $, window) {
    "use strict";
    
    SmartApps.nft = {};
    SmartApps.nft.factory =  async() => {
    	var blockchain = SmartApps.Blockchain;
    	await blockchain.init();
    	var factory = await blockchain.loadContractNFTFactory();
    	var smartnft     = await blockchain.loadContractSmartnft();
    	var wallet = await blockchain.getLoginWallet();
    	var GAS = 1000000;
    	const isGenerator = async () => {
    		let isGen = await factory.isGenerator(wallet).call();
    		console.log(isGen);
            return isGen;
    	}
    	const mintQuality = async (generation, quality) => {
            let isGen = await factory.isGenerator(wallet).call();
            if(isGen == false){
                await factory.addGenerator(wallet).send({gas:GAS}).then(async (value) => {
                    await factory.mintQuality(wallet,generation,quality).send({gas:GAS}).then((value) => {
                        console.log(value);
                    });
                });
            }else{
               
                console.log(wallet," Mint : 0 4");
                await factory.mintQuality(wallet,generation,quality).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
    		
    	}
        const mint = async () => {
            let isGen = await factory.isGenerator(wallet).call();
            if(isGen == true){
                console.log(wallet," Mint : 0 4");
                await factory.mint(wallet,0).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
            
        }
        const setFactory = async() => {
            let facAddress = await blockchain.address().AddressContractNFTFactory;

            await smartnft.setFactory(facAddress).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
        }
    	const getNFT = async () => {
    		let balance = await smartnft.balanceOf(wallet).call();
    		for(var i=1; i<=balance; i++) {
		        let id = await smartnft.tokenOfOwnerByIndex(wallet, i);
		        console.log(`#${i} id: ${id}`);
		    }

    		console.log(balance);
    	}
        isGenerator();
    	getNFT();
    	
    	$("#mintQuality").on("click", function(){
            var generation = $("#generation").val();
            var quality = $("#quality").val();
    		mintQuality(generation, quality);
    	});

        $("#setFactory").on("click", function(){
            setFactory();
        });
        $("#mint").on("click", function(){
            mint();
        });
        
        $(".contractaddress").html('<div>Contract : '+blockchain.address().AddressContractNFTFactory+'</div><div><a class="btn btn-md btn-primary" target="_bank" href="https://bscscan.com/address/'+blockchain.address().AddressContractNFTFactory+'">Contract</a></div>');
    }

    SmartApps.components.docReady.push(SmartApps.nft.factory);

    return SmartApps;
})(SmartApps, jQuery, window);
