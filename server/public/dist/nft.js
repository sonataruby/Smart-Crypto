
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
        const getHash = async () => {
            await blockchain.getNftTokenID('0x07001734f75842810691ca7a66cedf79a7107efe6ddff4c97157d4a82c994568');
        }
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
            let isStaticUser = await factory.isStaticUser(wallet).call();
            
            if(isStaticUser == true){
                
                await factory.mint(wallet,0).send({gas:GAS}).then( async (value) => {
                   
                    let tokenID = await blockchain.getNftTokenID(value.transactionHash);
                    if(tokenID > 0){
                        await axios.post("/api/nft/"+value.transactionHash);
                    }

                });
            }
            
        }
        const setFactory = async() => {
            let facAddress = await blockchain.address().AddressContractNFTFactory;

            await smartnft.setFactory(facAddress).send({gas:GAS}).then((value) => {
                    console.log(value);

                });
        }

        const addGenerator = async(setwallet) => {
            let isGenerator = await factory.isGenerator(setwallet).call();
            if(isGenerator == false){
                await factory.addGenerator(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }
        const removeGenerator = async(setwallet) => {
            let isGenerator = await factory.isGenerator(setwallet).call();
            if(isGenerator == true){
                await factory.removeGenerator(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }


        const setAdmin = async(setwallet) => {
            let isAdmin = await factory.isAdmin(setwallet).call();
            if(isAdmin == false){
                await factory.addAdmin(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }
        const removeAdmin = async(setwallet) => {
            let isAdmin = await factory.isAdmin(setwallet).call();
            if(isAdmin == true){
                await factory.renounceAdmin(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }


        const setStaticUser = async(setwallet) => {
            let isStaticUser = await factory.isStaticUser(setwallet).call();
            if(isStaticUser == false){
                await factory.addStaticUser(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }

        const removeStaticUser = async(setwallet) => {
            let isStaticUser = await factory.isStaticUser(setwallet).call();
            if(isStaticUser == true){
                await factory.removeStaticUser(setwallet).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
            }
        }
        
        const setURL = async (url) => {
            
            await smartnft.setBaseUri(url).send({gas:GAS}).then((value) => {
                    console.log(value);
            });
        }

        const trand = async(setwallet) => {
            //let smartnft = await blockchain.address().AddressContractNFTFactory;

            await smartnft.transferFrom(wallet,setwallet,4).send({gas:GAS}).then((value) => {
                    console.log(value);
                });
        }

    	const getNFT = async () => {
    		let balance = await smartnft.balanceOf(wallet).call();
    		for(var i=1; i<=balance; i++) {
		        let id = await smartnft.tokenOfOwnerByIndex(wallet, i);
                let option = await smartnft.paramsOf(i);
                console.log(option)
		        //console.log(id._parent);
		    }

            await smartnft.tokenURI(5).call().then((value) => {
                console.log(value);
            });
    		
    	}
        //getHash();
    	//getNFT();
    	//trand();
    	$("#mintQuality").on("click", function(){
            var generation = $("#generation").val();
            var quality = $("#quality").val();
    		mintQuality(generation, quality);
    	});

        $("#setFactory").on("click", function(){
            setFactory();
        });

        $("#setURL").on("click", function(){
            var seturl = $(this).parent().find("input").val();
            console.log(seturl);
            setURL(seturl);
        });
        
        $("#mint").on("click", function(){
            console.log("Mint");
            mint();
        });
        
        

        $("#addGenerator").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            addGenerator(setwallet);
        });
        
        $("#removeGenerator").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            removeGenerator(setwallet);
        });

        $("#addStaticUser").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            console.log(setwallet);
            setStaticUser(setwallet);
        });
        
        $("#removeStaticUser").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            removeStaticUser(setwallet);
        });


        $("#addAdmin").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            setAdmin(setwallet);
        });
        
        $("#removeAdmin").on("click", function(){
            var setwallet = $(this).parent().find("input").val();
            removeAdmin(setwallet);
        });


        
        $(".contractaddress").html('<div>Contract : '+blockchain.address().AddressContractNFTFactory+'</div><div><a class="btn btn-md btn-primary" target="_bank" href="https://bscscan.com/address/'+blockchain.address().AddressContractNFTFactory+'">Contract</a></div>');
    }

    SmartApps.components.docReady.push(SmartApps.nft.factory);

    return SmartApps;
})(SmartApps, jQuery, window);
