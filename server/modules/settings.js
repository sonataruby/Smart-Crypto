const db = require('./../db');
const _ = require("lodash");
const FarmController = {
	"findAll" : async () => {
		let sql = `SELECT * FROM settings ORDER BY id DESC LIMIT 100`;
		let data = await db.dbQuery(sql);
		return data;
	},
}
module.exports = FarmController;