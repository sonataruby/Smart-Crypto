const fsFile = require('./../fsFile');

module.exports = function(prefix , app) {
	app.get(prefix, (req, res) => {
	 const dataMain = fsFile.readJSONFile('main.json');
	 app.set('layout', './layout/pages');
	 dataMain.validateTelegram = 0;
	 if(req.query.telegram != undefined && req.query.telegram != "" && req.query.telegram == "confirm") dataMain.validateTelegram = 1;
	 dataMain.loadJS = ["airdrop.js"];
	 res.render(dataMain.public.airdrop == true ? "airdrop" : "coming",dataMain);
	});
}