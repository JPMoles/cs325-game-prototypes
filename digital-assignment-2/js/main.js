import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var config = {
    type: Phaser.AUTO,
	parent: 'game',
    width: 1200,
    height: 600,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 40 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var oasis;
var walls;
var desert; // finish zone
var space; // finish zone
var pins;
var music;
var finished;
var collided = false;


var game = new Phaser.Game(config);

function preload () {
    this.load.image('oasis', 'assets/Oasis.png');
	this.load.image('wall', 'assets/starting_post.png');
	this.load.image('desert', 'assets/desert_finish.png');
	this.load.image('space', 'assets/space_finish.png');
	this.load.image('cloud', 'assets/cloud1.png');
	this.load.image('pin', 'assets/pin.png');
	this.load.image('background', 'assets/space_background.jpg');
	this.load.audio('ding', 'assets/Mouth_pop.mp3');
	this.load.audio('music', 'assets/Blazer-Rail-2.wav');
}

function create () {
	
	music = this.sound.add('music');
	music.play();
	
	this.add.image(600, 300, 'background');
	
	walls = this.physics.add.staticGroup();
	walls.create(100, 400, 'wall');
	
	pins = this.physics.add.staticGroup();
	
	pins.create(200, 20, 'pin');
	pins.create(340, 20, 'pin');
	pins.create(490, 20, 'pin');
	pins.create(710, 20, 'pin');
	pins.create(1000, 20, 'pin');
	
	pins.create(200, 580, 'pin');
	pins.create(350, 580, 'pin');
	pins.create(490, 580, 'pin');
	pins.create(715, 580, 'pin');
	pins.create(1000, 580, 'pin');
	
	pins.create(320, 180, 'pin');
	pins.create(520, 180, 'pin');
	pins.create(720, 180, 'pin');
	
	pins.create(340, 380, 'pin');
	pins.create(550, 380, 'pin');
	pins.create(780, 380, 'pin');
	
	desert = this.physics.add.staticGroup();
	space = this.physics.add.staticGroup();
	
	space.create(1150, 150, 'space');
	desert.create(1150, 450, 'desert');
	
	oasis = this.physics.add.sprite(50, 500, 'oasis').setCircle(20);
	
	oasis.setCollideWorldBounds(true);
	oasis.setBounce(0.8);
	
	// learned how to do mouse input from this example: https://phaser.io/examples/v3/view/physics/arcade/move-to-pointer
	this.input.on('pointerdown', function (pointer) {
		if(oasis.body.x < 150) {
			this.physics.moveToObject(oasis, pointer, 250);
		}
	}, this);
	
	this.physics.add.collider(oasis, walls);
	
	this.physics.add.overlap(oasis, space, finishSpace, null, this);
	this.physics.add.overlap(oasis, desert, finishDesert, null, this);
	
	this.add.image(1150, 300, 'cloud').setScale(1.6);
	
	this.physics.add.collider(oasis, pins, pinBounce, null, this);
}

function pinBounce(oasis, pin) {
	oasis.setBounce(1);
	this.sound.play('ding');
}

function finishSpace(oasis, space) {
	if(oasis.body.x > 1110 && collided === false) {
		this.physics.pause();
		oasis.setTint(0xff0000);
		this.add.text(150, 250, 'The Oasis has been lost!', { fontSize: '64px', fill: '#FF0000' });
		collided = true;
	}
}

function finishDesert(oasis, desert) {
	if(oasis.body.x > 1110 && collided === false) {
		this.physics.pause();
		oasis.setTint(0x00ff00);
		this.add.text(500, 250, 'SUCCESS', { fontSize: '64px', fill: '#00FF00' });
		collided = true;
	}
}

function update () {
	
}