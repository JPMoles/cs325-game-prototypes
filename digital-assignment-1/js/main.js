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
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var potions1;
var potions2;

var score = 0;
var scoreText;

var bombs;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png'); // sky background from example
    this.load.image('ground', 'assets/Wooden_Platform.png');
    this.load.image('bomb', 'assets/bomb.png'); // bomb from example
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 }); // dude and frames from example
	this.load.image('potion1', 'assets/potion1.png');
	this.load.image('potion2', 'assets/potion2.png');
	this.load.audio('pop', 'assets/Mouth_pop.mp3');
}

// a large amount of the code is similar to the first game example
function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(400, 400, 'ground').setScale(0.5, 1).refreshBody();
    platforms.create(50, 225, 'ground').setScale(0.4, 1).refreshBody();
    platforms.create(750, 250, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
	
	potions1 = this.physics.add.group({
		key: 'potion1',
		repeat: 5,
		setXY: { x: 12, y: 0, stepX: 140 }
	});
	
	potions1.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});
	
	this.physics.add.collider(potions1, platforms);
	this.physics.add.overlap(player, potions1, collectPotion1, null, this);
	
	potions2 = this.physics.add.group({
		key: 'potion2',
		repeat: 5,
		setXY: { x: 82, y: 0, stepX: 140 }
	});
	
	potions2.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});
	
	this.physics.add.collider(potions2, platforms);
	this.physics.add.overlap(player, potions2, collectPotion2, null, this);
	
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
	
	bombs = this.physics.add.group();
	
	this.physics.add.collider(bombs, platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);
	
}

function hitBomb (player, bomb) {
	
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	
}

function collectPotion2 (player, potion2) {
	potion2.disableBody(true, true);
	
	score -= 12;
	scoreText.setText('Score: ' + score);
	
	if(potions2.countActive(true) === 0) {
		potions2.children.iterate(function (child) {
			child.enableBody(true, child.x, 0, true, true);
		});
		
	}
	
}

function collectPotion1 (player, potion1) {
	potion1.disableBody(true, true);
	this.sound.play('pop');
	
	score += 10;
	scoreText.setText('Score: ' + score);
	
	if(potions1.countActive(true) === 0) {
		potions1.children.iterate(function (child) {
			child.enableBody(true, child.x, 0, true, true);
		});
		
		var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
		
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}

function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}