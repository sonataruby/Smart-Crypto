var db;
var w3;
var contract;

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

		let period = obj.period; 
        let generation = 1;
        let startTime = obj.startTime;

        var StartSessionTime = startTime;
        
        let reward = w3.web3.utils.toWei(obj.reward.toString(), "ether"); 

        
		await contract.startSession(address.AddressContractSmartToken, reward, period, StartSessionTime, generation).send({from: "0xe6B84663Dc54b9B29f0a1A04B59e94d92BfE4DFf", gas : 300000}).then(async (value) => {
           sql = "INSERT INTO `farm_task` (`log_id`, `reward_token`, `reward_nft`, `timestart`, `min_deposit`, `pool_name`, `apr`, `period`, `status`) VALUES ('"+value+"', '"+obj.reward+"', '"+obj.nftreward+"', '"+obj.startTime+"', '"+obj.deposit+"', '"+obj.name+"', '"+obj.apr+"', '"+obj.period+"', '1');"
		   //console.log(obj);
		    await db(sql);
        });
		
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
	"syncDB" : (id) => {

		contract.sessions(id).call().then(async (value) => {
			console.log(value);
			var bNum = 10 ** 18;

			sql = "UPDATE `farm_task` SET `stakingToken` = '"+ value.stakingToken +"', `reward_token` = '"+(value.totalReward/ bNum)+"', `timestart` = '"+value.startTime+"', `amount_holder`= '"+(value.amount / bNum)+"', `claimed_paid`= '"+(value.claimed / bNum)+"', `claimedPerToken`= '"+(value.claimedPerToken / bNum)+"', `lastInterestUpdate`= '"+value.lastInterestUpdate+"', `interestPerToken`= '"+(value.interestPerToken / bNum)+"' WHERE `farm_task`.`log_id` = "+id+";";
			await db(sql);
		});
	},
	"status" : async (id, status) => {
		sql = "UPDATE `farm_task` SET `status` = '"+ status +"' WHERE `farm_task`.`log_id` = "+id+";"
		await db(sql);
	}
}
module.exports = FarmController;