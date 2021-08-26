var db;
var w3;
var contract;
const _ = require("lodash");
const FarmController = {
	"init" : async (dbs,blockchain) => {
		db = dbs;
		w3 = blockchain;
		contract = await blockchain.loadFram();
	},
	"findAll" : async () => {
		let sql = `SELECT * FROM farm_task ORDER BY timestart DESC LIMIT 100`;
		let data = await db(sql);
		return data;
	},
	"create" : async (obj) => {
		let address = await w3.loadAddress();

		let period = 3600 * parseInt(obj.period); 

	        let generation = 1;
	        let startTime = obj.startTime;

	        var StartSessionTime = startTime;
	        
	        let totalReward = w3.web3.utils.toWei(obj.reward.toString(), "ether"); 

        
		await contract.startSession(address.AddressContractSmartToken, totalReward, period, StartSessionTime, generation).send({from: "0xe6B84663Dc54b9B29f0a1A04B59e94d92BfE4DFf", gas : 300000}).then(async (value) => {
           let lastSessionId = 0;
           await contract.lastSessionIds(address.AddressContractSmartToken).call().then((value) => {
                lastSessionId = value;
            });

           if (lastSessionId != undefined && parseInt(lastSessionId) > 0) {
	           sql = "INSERT INTO `farm_task` (`log_id`, `reward_token`, `reward_nft`, `timestart`, `min_deposit`, `pool_name`, `apr`, `period`, `status`) VALUES ('"+lastSessionId+"', '"+obj.reward+"', '"+obj.nftreward+"', '"+obj.startTime+"', '"+obj.deposit+"', '"+obj.name+"', '"+obj.apr+"', '"+obj.period+"', '1');"
			   //console.log(obj);
			    await db(sql);
			}
        	});
        	 let lastSessionId = 0;
           await contract.lastSessionIds(address.AddressContractSmartToken).call().then((value) => {
                lastSessionId = value;
            });
        	return lastSessionId;
		
		//await db(sql);
	},
	"update" : async (id, name, status) => {
		sql = "UPDATE `farm_task` SET `pool_name`='"+name+"', `status` = '"+ status +"' WHERE `farm_task`.`log_id` = "+id+";"
		await db(sql);
	},
	"delete" : async (id) => {
		sql = "DELETE `farm_task` WHERE `farm_task`.`log_id` = "+id+";"
		await db(sql);
	},
	"syncDB" : async (id) => {
		if(id == 0){
			let lastSessionId = 0;
	           await contract.lastSessionIds(address.AddressContractSmartToken).call().then((value) => {
	                lastSessionId = value;
	            });
	          id = lastSessionId;
		}
		contract.sessions(id).call().then(async (value) => {
			
			var bNum = 10 ** 18;

			let amount = parseFloat(w3.web3.utils.fromWei(value.amount));
			let totalReward = parseFloat(w3.web3.utils.fromWei(value.totalReward));
			let startTime = parseInt(value.startTime);
			let period = parseInt(value.period);
			let rewardUnit = totalReward/period;
			let annualUnits = 31556952;  // 1 year in seconds
			let annualReward = rewardUnit * annualUnits * 1;
			let apy = parseFloat((annualReward/amount)*100).toFixed(2);
			let apr = parseFloat((annualReward/amount)*100).toFixed(2);
			
			sql = "UPDATE `farm_task` SET `stakingToken` = '"+ value.stakingToken +"', `apr` ='"+ apr +"', `apy` ='"+ apy +"', `reward_token` = '"+rewardUnit+"', `timestart` = '"+startTime+"', `period` = "+period+", `amount_holder`= '"+(value.amount / bNum)+"', `max_amount` = '"+(value.totalReward / bNum)+"', `totalReward` = '"+totalReward+"', `claimed_paid`= '"+(value.claimed / bNum)+"', `claimedPerToken`= '"+(value.claimedPerToken / bNum)+"', `lastInterestUpdate`= '"+value.lastInterestUpdate+"', `interestPerToken`= '"+(value.interestPerToken / bNum)+"' WHERE `farm_task`.`log_id` = "+id+";";
			await db(sql);
		});
	},
	"status" : async (id, status) => {
		sql = "UPDATE `farm_task` SET `status` = '"+ status +"' WHERE `farm_task`.`log_id` = "+id+";"
		await db(sql);
	}
}
module.exports = FarmController;