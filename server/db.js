let mysql = require('mysql');
let config = require('./../config');
var pool  = mysql.createPool({
  	connectionLimit : 10,
  	host: config.db_config.host,
	user: config.db_config.user,
	password: config.db_config.password,
	database: config.db_config.database
});

module.exports.dbQuery = async (sql, rows=false) =>{
	return new Promise(function(resolve, reject){
		pool.query(sql,function (error, results){
				if (error) {
					console.log("Error query",error)
                	resolve([]);
				}else{
					if(results.length > 0){
						rows == false ? resolve(results) : resolve(results[0]);
					}else{
						resolve();
					}
					
				}
			});
	}).catch((err) => {
		console.log(err);
		
	});
}