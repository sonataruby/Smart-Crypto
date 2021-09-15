const TelegramBot = require('node-telegram-bot-api');
var telegram = require('./config').telegram;

const express = require("express");
const app = express();

const bot = new TelegramBot(telegram.token, {polling: true});
const img_url = 'https://cdn-images-1.medium.com/max/1200/1*b708XUPLvguJNmrpbg8oXg.jpeg'
var contractAddress = '';
/*
bot.onText(/\/start\/(.+)/, (msg,match) => {
    contractAddress = match[1];
    bot.sendPhoto(msg.chat.id,img_url,{
        caption : "Welcome to Smart Crypto Bot\n "}).then(() => {
        var option = {
            "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        };
        bot.sendMessage(msg.chat.id,contractAddress+"\n",option);
    })
});
*/

bot.onText(/\/start/, (msg,match) => {
    
    var option = {
            "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        };
    bot.sendMediaGroup(msg.chat.id,[
            "https://cryptocar.cc/nfts/0.gif",
            "https://cryptocar.cc/nfts/1.gif",
            "https://cryptocar.cc/nfts/2.gif",
            "https://cryptocar.cc/nfts/3.gif"
        ],{
        caption : "Welcome to Smart Crypto Bot\n ",
        "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        });
    bot.sendPhoto(msg.chat.id,img_url,{
        caption : "Welcome to Smart Crypto Bot\n ",
        "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        });
});

const telegramJoin = async () => {
    var text = 'Join Telegram Group';
    var keyboardStr = JSON.stringify({
        inline_keyboard: [
          [
              {text:'Join Telegram Group',url:'https://t.me/eraswap'},
              {text:'Join Telegram Channel',url:'https://t.me/eraswap'},
              {text:'Next Step 3'}
          ]
        ]
    });
    var keyboard = {reply_markup: JSON.parse(keyboardStr)};
    bot.sendMessage(msg.chat.id,text,keyboard);
};

var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
/*
bot.on('message', (msg) => {
    var send_text = msg.from.text;
   
    var task = [
        {text : "Join Start >>", callback : telegramJoin},
        {text : "Step 2", callback : telegramJoin},
        {text : "Step 3", callback : telegramJoin},
        {text : "Step 4", callback : telegramJoin},
        {text : "Step 5", callback : telegramJoin}
        ];
    
    task.each(function (key, callback){
        console.log(key);
        if (send_text.toString().indexOf(step1_text) === 0) {
        
        }
    });
    
});
*/

app.post("/telegram", (req, res) => {
  var msg = req.body.text;
  bot.sendMessage(config.telegram.TelegramChannel,msg);
  var data = '{"ok": "200"}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.listen(8082, () =>
  console.log(`Example app listening on port 8082!`),
);