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

module.exports.dbQuery = async function(con, sql) {
	return new Promise(data => {
        
        con.query(sql, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                data('{"error": "404 page not found", "err_code": 404}');
            }
            try {
                

                data(JSON.stringify(result));

            } catch (error) {
                data('{"error": "404 page not found", "err_code": 404}');
            }

        });
    });
}