SmartApps=function(a,n,t){"use strict";var l,o;a.tokenPresell={};let s=a.Blockchain,c=a.tokenSmart;return a.tokenPresell={loadContracts:async()=>{l=await s.loadContractPresell(),o=await s.getLoginWallet()},setup:async()=>{await axios.get("https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&api_key=c0cc3568f034c2ab6eaf1e70a429b1aae1a6aa10187eabfd3849fa59eccc35e4").then(async a=>{var e=await s.loadContractIDO();let t=a.data.USD;await e.getPrice().call().then(function(a){var e=Number(1/a).toFixed(8).replace(/\d(?=(\d{3})+\.)/g,"$&,"),a=Number(1/a).toFixed(4).replace(/\d(?=(\d{3})+\.)/g,"$&,");0<t?e=(t*e).toFixed(4)+" USD":e+=" BNB",n(".price").html(e),n(".pricebnb").html(a)})}).catch(a=>{console.log(a)})},presell:async e=>{0==await s.isStatus()&&await s.connect();var a=s.toWei(e.toString());l.buyPreSell().send({value:a,gas:3e5}).then(async function(a){s.notify("Buy token successful Tx : "+a.transactionHash);await c.symbol();""!=t.TelegramChannel&&null!=t.TelegramChannel&&await axios.post("/telegram",{text:`${o} Join Pre-Sell Buy ${e} BNB`})})},withdrawBNB:async()=>{await l.withdrawBNB().send({gas:3e5}).then(a=>{console.log(a)})},withdrawNCF:async()=>{await l.withdrawNCF(685350).send({gas:3e5}).then(a=>{console.log(a)})}},a.tokenPresell.Init=async()=>{await s.init();var e=a.tokenPresell;await e.loadContracts(),await e.setup(),n("#btnBuyToken, [data-web3=presell]").on("click",function(){var a=n("#presellValue").val(),a=0<a?a:.1;e.presell(a.toString())})},a.components.docReady.push(a.tokenPresell.Init),a}(SmartApps,jQuery,window);