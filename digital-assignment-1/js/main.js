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

class MyScene extends Phaser.Scene {
	
    constructor() {
        super();
		this.cursors = null;
    }
    
    preload() {
		this.load.image( 'ground', 'assets/platform.png');
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.image( 'potion1', 'assets/potion1.png');
		this.load.image( 'potion2', 'assets/potion2.png');
    }
    
    create() {
		
		var platforms = this.physics.add.staticGroup();

		platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');
		
		var player = this.physics.add.sprite(100, 450, 'dude');

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

		var potion1 = this.physics.add.sprite(200, 400, 'potion1');
		var potion2 = this.physics.add.sprite(100, 300, 'potion2');
		
		this.physics.add.collider(player, platforms);
		
		cursors = this.input.keyboard.createCursorKeys();
		
	}
    
    update() {
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
}

var config = {
	type: Phaser.AUTO,
	parent: 'game',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade'
	},
	scene: MyScene
};

const game = new Phaser.Game(config);
