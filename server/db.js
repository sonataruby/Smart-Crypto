let mysql = require('mysql');
let config = require('./../config');
var pool  = mysql.createPool({
  	connectionLimit : 10,
  	host: config.db_config.host,
	user: config.db_config.user,
	password: config.db_config.password,
	database: config.db_config.database
});

module.exports.dbQuery = async (sql) =>{
	return new Promise(function(resolve, reject){
		pool.query(sql,function (error, results){
				if (error) {
                	resolve([]);
				}else{
					if(results.length > 0){
						resolve(results);
					}else{
						resolve();
					}
					
				}
			});
	}).catch((err) => {
		console.log(err);
		
	});
}