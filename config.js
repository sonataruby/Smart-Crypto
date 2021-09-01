var db_config = {
	port : 5000,
	host: "localhost",
	user: "root",
	password: "root",
	database: "expresstoken"
}
var layout_config = {
	dir : __dirname + "/apps/layout"
}
module.exports.layout = layout_config;
module.exports.db_config = db_config;