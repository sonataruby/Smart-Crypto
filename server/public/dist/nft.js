
SmartApps = (function (SmartApps, $, window) {
    "use strict";
    
    SmartApps.nft = {};
    SmartApps.nft.factory =  async() => {
    	var blockchain = SmartApps.Blockchain;
    	await blockchain.init();
    	var factory = await blockchain.loadContractNFTFactory();
    	var smartnft     = await blockchain.loadContractSmartnft();
    	var wallet = await blockchain.getLoginWallet();
        var item = await blockchain.loadContractNFTItem();
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
        const mint = async (name) => {
            let isStaticUser = await factory.isStaticUser(wallet).call();
            
            if(isStaticUser == true){
                let number = Math.floor(Math.random() * (15 - 1) ) + 1;
                await factory.mintCar(name,number).send({gas:GAS}).then( async (value) => {
                   
                    let tokenID = await blockchain.getNftTokenID(value.transactionHash);
                    console.log(tokenID);

                });
            }
            
        }
        const nftCarSetup = async() => {
            let facAddress = await blockchain.address().AddressContractNFTFactory;

            await smartnft.setFactory(facAddress).send({gas:GAS}).then((value) => {
                    console.log(value);

                });
            let itemAddress = await blockchain.address().AddressContractNFTItem;
            await smartnft.setItemFactory(itemAddress).send({gas:GAS}).then((value) => {
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
            console.log(isStaticUser, " ", setwallet);
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

        const factorySetCar = async(address, address_exp) => {
            factory.setNft(address).send({gas:GAS}).then((value) => {
                console.log(value);
            });
            factory.setNftExp(address_exp).send({gas:GAS}).then((value) => {
                console.log(value);
            });
        }
        
        const setURL = async (url) => {
            
            await smartnft.setBaseUri(url).send({gas:GAS}).then((value) => {
                    console.log(value);
            });
        }

        const setCarsLever = async (id,exp,Speed,Acceleraction,Handing,Nitro) => {
            
            await factory.setLeverRole(id,exp,Speed,Acceleraction,Handing,Nitro).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }

        const setLever = async (tokenid,v) => {
            
            await factory.setLever(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }
        const setModels = async (tokenid,v) => {
            
            await factory.setModels(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }

        const setPower = async (tokenid,v) => {
            
            await factory.setPower(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }
        const setSpeed = async (tokenid,v) => {
            
            await factory.setSpeed(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }

        const setAcceleraction = async (tokenid,v) => {
            
            await factory.setAcceleraction(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
            });
        }
        
        const setHanding = async (tokenid,v) => {
            
            await factory.setHanding(tokenid,v).send({gas:GAS}).then((value) => {
                    alert("Update ok");
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

        const nftitemSetup = async () => {
            let facAddress = await blockchain.address().AddressContractNFTFactory;
            item.setFactory(facAddress).send({gas:GAS}).then((value) => {
                console.log(value);
            });
        };
        const CreateItemExp = async (id, exp) => {
            
            await factory.mintItem(id,exp).send({gas:GAS}).then((value) => {
                console.log(value);
            });
        };

        const getLeverInfo = async (id) => {
            
            for (var i = 1; i <= 15; i++) {
                await smartnft.LeverOf(i).call().then((value) => {
                    var indexLayer = $("#LeverIndex"+i);
                    indexLayer.find(".exp").val(value.Exp);
                    indexLayer.find(".Speed").val(value.Speed);
                    indexLayer.find(".Acceleraction").val(value.Acceleraction);
                    indexLayer.find(".Handing").val(value.Handing);
                    indexLayer.find(".Nitro").val(value.Nitro);
                });
            }
        }
        

        //getHash();
    	//getNFT();
    	//trand();
        //setStaticUser(0x7a397c2bC6dfDA421975435ca41fc5F4318Ea3E9);
       
        getLeverInfo();
        
        

    	$("#mintQuality").on("click", function(){
            var generation = $("#generation").val();
            var quality = $("#quality").val();
    		mintQuality(generation, quality);
    	});

       

        $("#setURL").on("click", function(){
            var seturl = $(this).parent().find("input").val();
            console.log(seturl);
            setURL(seturl);
        });
        
        $("#mint").on("click", function(){
            var name = $(this).parent().find("input").val();
            console.log(name);
            mint(name);
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

        $("#setupfatory").on("click", function(){
            var nft = $(this).data("nft");
            var nft_exp = $(this).data("nft_exp");
            factorySetCar(nft, nft_exp);

        });
        
        $("#setupcar").on("click", function(){
            var factory = $(this).data("nft");
            var nft_exp = $(this).data("nft_exp");
            nftCarSetup();

        });
        $("#setupexp").on("click", function(){
            
            nftitemSetup();

        });
        
        $("#CreateItem").on("click", function(){
            var id =  parseInt($(this).parent().find("input.id").val());
            var exp = parseInt($(this).parent().find("input.exp").val());
            if(id == 0 || exp == 0 || isNaN(id) || isNaN(exp)){
                alert(id + " and "+exp+" > 0");
                return;
            }
            CreateItemExp(id,exp);

        });

        $(".actionLever").on("click", function(){
            var tr = $(this).parent().parent();
            var leverid = $(this).data("lvid");
            var exp = tr.find("input.exp").val();
            var Speed = tr.find("input.Speed").val();
            var Acceleraction = tr.find("input.Acceleraction").val();
            var Handing = tr.find("input.Handing").val();
            var Nitro = tr.find("input.Nitro").val();
            if(exp == 0) {
                alert("exp > 0");
                return false;
            }
            setCarsLever(leverid, exp,Speed,Acceleraction,Handing,Nitro);
        });

        $("#setLever").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setLever(tokenid,setvalue);
        });
        
        $("#setModels").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setModels(tokenid,setvalue);
        });

        $("#setSpeed").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setSpeed(tokenid,setvalue);
        });

        $("#setAcceleraction").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setAcceleraction(tokenid,setvalue);
        });

        $("#setHanding").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setHanding(tokenid,setvalue);
        });
        $("#setNitro").on("click", function(){
            var tokenid = $("#inputIDToken").val();
            var setvalue = $(this).parent().find("input").val();
            setNitro(tokenid,setvalue);
        });

        $(".contractaddress").html('<div>Contract : '+blockchain.address().AddressContractNFTFactory+'</div><div><a class="btn btn-md btn-primary" target="_bank" href="https://bscscan.com/address/'+blockchain.address().AddressContractNFTFactory+'">Contract</a></div>');
    }

    SmartApps.components.docReady.push(SmartApps.nft.factory);

    return SmartApps;
})(SmartApps, jQuery, window);
