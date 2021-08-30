SmartApps = (function (SmartApps, $, window) {
        "use strict";
        
    var contractPresell;
    var login_wallet;
    let GAS = 300000; 
    SmartApps.tokenPresell = {};
    let blockchain = SmartApps.Blockchain;
    let tokenSmart = SmartApps.tokenSmart;
    SmartApps.tokenPresell = {

        loadContracts: async () => {

            contractPresell = await blockchain.loadContractPresell();
            
            login_wallet = await blockchain.getLoginWallet();
        },
        setup : async () => {
            
        },
        presell : async (amount) => {
            let status = await blockchain.isStatus();
            if(status == false){
                await blockchain.connect();
            }
            
            const vamount =  blockchain.toWei(amount.toString());
            contractPresell.buyToken()
              .send({ value: vamount, gas : GAS})
              .then(async function (res) {
                    notify("Buy token successful Tx : "+res.transactionHash);
                    await axios.post('https://api.telegram.org/bot1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg/sendMessage', {
                            chat_id: window.TelegramChannel,
                            text: `${login_wallet} Join Pre-Sell Buy ${amount} ${tokenSmart.symbol()}`,
                            parse_mode:'Markdown'
                    });
              });
        }
    }

    SmartApps.tokenPresell.Init = async () => {
        
    }
    
    SmartApps.components.docReady.push(SmartApps.tokenPresell.Init);

 return SmartApps;
})(SmartApps, jQuery, window);