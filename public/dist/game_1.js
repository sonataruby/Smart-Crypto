jQuery(document).ready(function(){


var Dom = {

  get:  function(id)                     { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  set:  function(id, html)               { Dom.get(id).innerHTML = html;                        },
  on:   function(ele, type, fn, capture) { Dom.get(ele).addEventListener(type, fn, capture);    },
  un:   function(ele, type, fn, capture) { Dom.get(ele).removeEventListener(type, fn, capture); },
  show: function(ele, type)              { Dom.get(ele).style.display = (type || 'block');      },
  blur: function(ev)                     { ev.target.blur();                                    },

  

  storage: window.localStorage || {}

}


var config = {
    type: Phaser.AUTO,
    width: document.getElementById("game").offsetWidth,
    height: 600,
    parent: document.getElementById("game"),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        render: render
    },
    google: {
      families: ['Revalia']
    }

};

const blockchain = SmartApps.tokenFarm;

var game = new Phaser.Game(config);

function resizeGame() {
    game.scale.setGameSize(document.getElementById("game").offsetWidth, $( window ).height());
}

$( window ).resize(function() {
    resizeGame();
}); 

function preload ()
{

    this.load.setBaseURL('/');

    this.load.image('sky', game_1.background);
    this.load.image('controller', 'assets/car/control.png');
    this.load.image('logo', 'assets/car/logo_game.png');
    this.load.image('red', 'assets/car/start.png');
    this.load.image('claimnft', 'assets/car/claimnft.png');
    this.load.image('deposit', 'assets/images/DEPOSIT.png');
    this.load.image('claim', 'assets/images/CLAIM.png');
    this.load.image('withdraw', 'assets/images/WITHDRAW.png');
    
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

function playMusic(){
    var music = Dom.get('music');
    music.loop = true;
    music.volume = 0.05; // shhhh! annoying music!
    music.muted = (Dom.storage.muted === "true");
    music.play();
    /*
    Dom.toggleClassName('mute', 'on', music.muted);
    Dom.on('mute', 'click', function() {
      Dom.storage.muted = music.muted = !music.muted;
      Dom.toggleClassName('mute', 'on', music.muted);
    });
    */
  }

function create ()
{
	let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
	let scaleX = this.cameras.main.width / image.width
	let scaleY = this.cameras.main.height / image.height
	let scale = Math.max(scaleX, scaleY)
	image.setScale(scale).setScrollFactor(0)

	//this.add.image(400, 210, 'controller');


	
	var textOptionsPool = { fill: game_1.color,fontFamily : 'Revalia', fontSize : 48, fontWeight : 'bold', shadow : (5, 5, 'rgba(0,0,0,0.5)', 5) , anchor : 0.5, stroke : '#FFF', strokeThickness : 3};

	var textOptions = { fill: game_1.color,fontFamily : 'Revalia', fontSize : 24, fontWeight : 'bold', shadow : (5, 5, 'rgba(0,0,0,0.5)', 5) , anchor : 0.5, stroke : '#FFF', strokeThickness : 0};
	var textOptions1 = { fill: game_1.color2,fontFamily : 'Revalia', fontSize : 18, fontWeight : 'bold'};

	this.add.text(100, 30, game_1.pool_name, textOptionsPool);
	var OptionHightTop = 10;
	this.add.text(100, OptionHightTop+80, 'Total Value Lock', textOptions1);
	this.add.text(100, OptionHightTop+100, game_1.amount, textOptions);
	
	this.initialTime = game_1.timeEnd;
	this.add.text(100, OptionHightTop+130, 'Remaining Time', textOptions1);
	CountDownTime = this.add.text(100, OptionHightTop+150, '2021/01/09 0:0:0', textOptions);
	timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

	this.add.text(100, OptionHightTop+190, 'Pool Rate', textOptions1);
	this.add.text(100, OptionHightTop+210, game_1.rate, textOptions);
	this.add.text(100, OptionHightTop+250, 'APR', textOptions1);
	this.add.text(100, OptionHightTop+270, game_1.apr, textOptions);
 	

 	this.add.text(500, OptionHightTop+80, 'Your Liquidity Deposit', textOptions1);
	this.add.text(500, OptionHightTop+100, game_1.deposit, textOptions);
	this.add.text(500, OptionHightTop+130, 'Your Power', textOptions1);
	this.add.text(500, OptionHightTop+150, game_1.aprweek, textOptions);

	this.add.text(500, OptionHightTop+190, 'Your Claim', textOptions1);
	this.add.text(500, OptionHightTop+210, game_1.claimable, textOptions);

	
	var buttonOptions = { fill: '#dc3545',align : 'center',backgroundColor:'red',fontSize : 24, fontWeight : 'bold', shadow : (5, 5, 'rgba(0,0,0,0.5)', 5) , anchor : 0.5, stroke : '#FFF', strokeThickness : 2};

	var setButtonControll = 160;
	var setButtonControll2 = setButtonControll + 160;
	var setButtonControll3 = setButtonControll + 295;
	if(document.getElementById("game").offsetWidth < 520){
		setButtonControll = 60;
	}
	if(game_1.status == 1){
	const deposit = this.add.image(setButtonControll, 380, 'deposit')
		.setInteractive()
		.on('pointerdown', () => {
			blockchain.createpool(game_1.id);
		});
		setButtonControll2 = setButtonControll + 140;
		setButtonControll3 = setButtonControll + 280;
	}else{
		setButtonControll2 = setButtonControll;
		setButtonControll3 = setButtonControll + 160;
	}

	if(game_1.status == -1 || game_1.status == 1){
		const ClaimButton = this.add.image(setButtonControll2, 380, 'claim').setInteractive()
			.on('pointerdown', () => {
				console.log("Click Claim");
				blockchain.claim(game_1.id);
			});
		const WithdrawButton = this.add.image(setButtonControll, 440, 'withdraw').setInteractive()
			.on('pointerdown', () => {
				console.log("Click Withdraw");
				blockchain.withdraw(game_1.id);
			});

		const ClaimNFTButton = this.add.image(setButtonControll2, 440, 'claimnft').setInteractive()
			.on('pointerdown', () => {
				console.log("Click Claim NFT");
				blockchain.claimNft(game_1.id);
			});
		
	}else{
		this.add.text(setButtonControll, 400, "Wait game start", textOptions);
	}

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });
    
    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 50);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    playMusic();
    
}


function render(){
	
}


function onEvent ()
{
    this.initialTime -= 1; // One second
    CountDownTime.setText(moment.unix(this.initialTime).format('YYYY/MM/DD HH:mm:ss'));
}

});