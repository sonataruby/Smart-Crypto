var Mint = {
  preload: function () {
    game.load.image(
      "mintbg",
      "./game/car/images/mintbg.png"
    );
    game.load.image(
      "mintbutton",
      "./game/car/images/mintbutton.png"
    );
    game.load.image(
      "homebutton",
      "./game/car/images/homebutton.png"
    );
  },

  create: function () {
    game.add.sprite(0, 0, "mintbg");
    this.add.button(300, 400, "mintbutton", this.mintCar, this);
    this.add.button(1180, 10, "homebutton", this.home, this);
  },

  mintCar: function () {
    contract.methods
      .mintCar()
      .send({ from: web3.eth.defaultAccount })
      .then(function (res) {
        console.log(res, "MINTED");
        game.state.start('CarsListLoader');
      });
  },

  home: function () {
    game.state.start('Login');
  }
};
