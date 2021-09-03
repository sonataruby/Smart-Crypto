const axios = require('axios').default;
const fsFile = require('./../fsFile');
const hostname = "http://localhost:5000";
module.exports = function(prefix , app) {
	app.get(prefix, (req, res) => {
	const dataMain = fsFile.readJSONFile('main.json');
 
	 app.set('layout', './layout/pages');
	 dataMain.loadJS = ["ido.js"];
	 res.render(dataMain.public.ido == true ? "ido" : "coming",dataMain);
	});
}