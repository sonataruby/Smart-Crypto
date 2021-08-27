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

let call = async function(instance, method, address, args) {
    let raw = await instance.methods[method](...args).call();
    return raw;
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
let loadFram =  async function() {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/../apps/abi/farm.json', 'utf8'));
    var farmAddress = await loadAddress();
    
    let contract = await loadContract(farmAddress.AddressContractFarm, farmArtifact);
    return contract.methods;
};

module.exports.addAccount = addAccount;
module.exports.loadContract = loadContract;
module.exports.loadFram = loadFram;
module.exports.call = call;
module.exports.web3 = web3;
module.exports.loadAddress = loadAddress;