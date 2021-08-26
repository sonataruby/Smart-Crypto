var game;
var NFT_balance;

//new game instance
game = new Phaser.Game({width : 1200, height : 860, type : Phaser.AUTO, parent: document.getElementById("game")});

game.state.add("Login", Login);
game.state.add("Mint", Mint);
game.state.add("CarsListLoader", CarsListLoader);
game.state.add("CarsList", CarsList);
game.state.add("ChallengeChooser", ChallengeChooser);
game.state.add("ChallengesListLoader", ChallengesListLoader);
game.state.add("ChallengesList", ChallengesList);
game.state.add("Game", Game);
game.state.add("OpenForBattle", OpenForBattle);

game.state.start("Login");