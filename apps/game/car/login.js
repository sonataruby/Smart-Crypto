var Login = {
  preload: function () {
    game.load.image(
      "homescreen",
      "./game/car/images/homescreen.png"
    );
    game.load.image(
      "metamasklogin",
      "./game/car/images/metamasklogin.png"
    );
  },

  create: function () {
    game.add.sprite(0, 0, "homescreen");
    this.add.button(450, 450, "metamasklogin", this.web3login, this);
  },

  web3login: function () {
    contract.methods
      .balanceOf(web3.eth.defaultAccount)
      .call()
      .then(function (res) {
        console.log(res, "BALANCE");
        NFT_balance = res;
        if(NFT_balance == 0) {
          game.state.start('Mint');
        } else {
          game.state.start('CarsListLoader');
        }
      });
  },
};
