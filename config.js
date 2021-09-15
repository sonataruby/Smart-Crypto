var db_config = {
	port : 5000,
	host: "localhost",
	user: "root",
	password: "root",
	database: "expresstoken"
}
var redirect = "";
const allowCustoms = true;
var server = {
	public : "http://localhost",
	api :  "http://api.localhost",
	cdn : "https://cryptocar.cc/nfts"
}
var layout_config = {
	//dir : __dirname + "/apps/layout"
	dir : __dirname + "/webdata/ubg/layout",
	getPage : (page) => {
		if(allowCustoms == false){
			return page;
		}
		return __dirname + "/webdata/ubg/layout/" + page;
	}
}


module.exports.server = server;
module.exports.layout = layout_config;
module.exports.db_config = db_config;
module.exports.redirect = redirect;

var telegram = {
	token : "1962248837:AAGecDXTz2hnsdauDN--mOafqBYS5o-jQsg",
	TelegramChannel : "@Cryptocar_Global"
}
module.exports.telegram = telegram;