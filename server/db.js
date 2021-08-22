let mysql = require('mysql');


module.exports.getConnection = async function() {
	let con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "expresstoken"
	});

	let res = await con.connect();

	return con;
};