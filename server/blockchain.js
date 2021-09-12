let Web3 = require('web3');
let fs = require('fs');

let web3 = new Web3("https://bsc-dataseed.binance.org");

let addAccount = function(privateKey) {
	
    // add account from privatekey to web3 to sign contracts
    if (privateKey == undefined) {
        throw "No private key found. Can not connect to blockchain";
    }

    let AccountMaster = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(AccountMaster);
    return AccountMaster;
};

let loadContract = async function(address, abi) {
    let contract = await new web3.eth.Contract(abi, address)

    return contract;
};



let loadToken = async function() {
   /*
    var crownsArtifact = JSON.parse(fs.readFileSync('./abi/CrownsToken.json', 'utf8'));
    var crownsAddress = process.env.CROWNS_ADDRESS;
    var crowns = await loadContract(crownsAddress, crownsArtifact.abi);

    return crowns;
    */
};
let loadAddress = async function(){
     var farmAddressJSON = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/address.json', 'utf8'));
     return farmAddressJSON;
} 
let loadFram =  async function(address) {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/farm.json', 'utf8'));
    var farmAddress = await loadAddress();
    var addressLoad = address == undefined || address.length < 40 ? farmAddress.AddressContractFarm : address;
    
    let contract = await loadContract(addressLoad, farmArtifact);
    return contract.methods;
};



let loadSmartNFT =  async function() {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/smartnft.json', 'utf8'));
    var farmAddress = await loadAddress();
    
    let contract = await loadContract(farmAddress.AddressContractSmartNFT, farmArtifact);
    return contract.methods;
};

let loadNFTItem =  async function() {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/nftitem.json', 'utf8'));
    var farmAddress = await loadAddress();
    
    let contract = await loadContract(farmAddress.AddressContractNFTItem, farmArtifact);
    return contract.methods;
};

let loadMarketNFT =  async function() {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/nftmarket.json', 'utf8'));
    var farmAddress = await loadAddress();
    
    let contract = await loadContract(farmAddress.AddressContractNFTMarket, farmArtifact);
    return contract.methods;
};
let getHash =  async function() {
    return web3.eth;
}

module.exports.addAccount = addAccount;
module.exports.loadContract = loadContract;
module.exports.loadFram = loadFram;
module.exports.web3 = web3;
module.exports.loadAddress = loadAddress;
module.exports.loadSmartNFT = loadSmartNFT;
module.exports.loadMarketNFT = loadMarketNFT;
module.exports.loadNFTItem = loadNFTItem;

module.exports.getHash = getHash;