SmartApps = (function (SmartApps, $, window) {

let contractStaking;
let login_wallet;
let GAS = 300000; 



    SmartApps.Staking = () => {
        const Controller = {
            loadContracts: async () => {

                contractStaking = await blockchain.loadContractStaking();
                
                login_wallet = await blockchain.getLoginWallet();
            },
            setup : async () => {
                
            }
        }
        SmartApps.Staking = Controller;
    }
    
    SmartApps.components.docReady.push(SmartApps.Staking);

 return SmartApps;
})(SmartApps, jQuery, window);