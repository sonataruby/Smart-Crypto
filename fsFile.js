const fs = require('fs');
const path = require("path");
const _ = require("lodash");
//const socket = io.listen(server);

module.exports = {
    readJSONFile : (filename) =>{
      let jsonData = require(path.resolve(__dirname, "json/"+filename));
      let jsonToken = require(path.resolve(__dirname, "json/main.json"));
      let jsonAddress = require(path.resolve(__dirname, "apps/abi/address.json"));
      jsonToken.contractAddress = jsonAddress;

      let jsonMage = Object.assign({}, jsonToken, jsonData);
      //console.log(_.mergeWith(jsonToken, jsonData, jsonMage));
    	return _.mergeWith(jsonToken, jsonData, jsonMage);
    },
    layout : (file) => {
        var files = path.resolve(__dirname, "public/layout/"+file);
        console.log(files);
        return files;
    },
    render : (file) => {
        var files = path.resolve(__dirname, "public/"+file);
        console.log(files);
        return files;
    }
}