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

/*

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
                    player: null,
                    reticle: null,
                    moveKeys: null,
                    bullets: null,
                    lastFired: 0,
                    time: 0,
                }
    }
};

var game = new Phaser.Game(config);
var player;
var reticle;
var moveKeys;
var avgX;
var avgY;

function preload ()
{
    // Load in images and sprites
    this.load.spritesheet('player_handgun', 'assets/player_handgun.png',
        { frameWidth: 66, frameHeight: 60 }
    ); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
    this.load.image('target', 'assets/ball.png');
    this.load.image('background', 'assets/underwater1.png');
}

function create ()
{
    // Create world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Add background, player, and reticle sprites
    var background = this.add.image(800, 600, 'background');
    player = this.physics.add.sprite(800, 600, 'player_handgun');
    reticle = this.physics.add.sprite(800, 700, 'target');

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);

    // Set camera zoom
    this.cameras.main.zoom = 0.5;

    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    // Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp)
            player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp)
            player.setAccelerationX(0);
    });

    // Locks pointer on mousedown
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
      if (this.input.mouse.locked)
      {
          // Move reticle with mouse
          reticle.x += pointer.movementX;
          reticle.y += pointer.movementY;

          // Only works when camera follows player
          var distX = reticle.x-player.x;
          var distY = reticle.y-player.y;

          // Ensures reticle cannot be moved offscreen
          if (distX > 800)
              reticle.x = player.x+800;
          else if (distX < -800)
              reticle.x = player.x-800;

          if (distY > 600)
              reticle.y = player.y+600;
          else if (distY < -600)
              reticle.y = player.y-600;
      }
    }, this);

}

// Ensures sprite speed doesnt exceed maxVelocity while update is called
function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

// Ensures reticle does not move offscreen and dist(radius) from player
function constrainReticle(reticle, radius)
{
  var distX = reticle.x-player.x; // X distance between player & reticle
  var distY = reticle.y-player.y; // Y distance between player & reticle

  // Ensures reticle cannot be moved offscreen
  if (distX > 800)
      reticle.x = player.x+800;
  else if (distX < -800)
      reticle.x = player.x-800;

  if (distY > 600)
      reticle.y = player.y+600;
  else if (distY < -600)
      reticle.y = player.y-600;

  // Ensures reticle cannot be moved further than dist(radius) from player
  var distBetween = Phaser.Math.Distance.Between(player.x, player.y, reticle.x, reticle.y);
  if (distBetween > radius)
  {
      // Place reticle on perimeter of circle on line intersecting player & reticle
      var scale = distBetween/radius;

      reticle.x = player.x + (reticle.x-player.x)/scale;
      reticle.y = player.y + (reticle.y-player.y)/scale;
  }
}

function update (time, delta)
{
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Camera position is average between reticle and player positions
    avgX = ((player.x+reticle.x)/2)-400;
    avgY = ((player.y+reticle.y)/2)-300;
    this.cameras.main.scrollX = avgX;
    this.cameras.main.scrollY = avgY;

    // Make reticle move with player
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;

    // Constrain velocity of player
    constrainVelocity(player, 500);

    // Constrain position of reticle
    constrainReticle(reticle, 550);
}

*/


var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
                    player: null,
                    healthpoints: null,
                    reticle: null,
                    moveKeys: null,
                    playerBullets: null,
                    enemyBullets: null,
                    time: 0,
                }
    }
};

var game = new Phaser.Game(config);

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var BulletC = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function BulletC (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'carrot_bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var BulletB = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function BulletB (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'broccoli_bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(32, 24, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var playerBulletsCarrots;
var playerBulletsBroccoli;
var enemys;

var playerBullets;
var enemyBullets;
var player;
var enemy;
var reticle;
var hp1;
var hp2;
var hp3;
var moveKeys;

function preload ()
{
    // Load in images and sprites
    this.load.spritesheet('player_handgun', 'assets/spaceman.png',
        { frameWidth: 66, frameHeight: 60 }
    ); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
    this.load.image('carrot_bullet', 'assets/carrot.png');
	this.load.image('broccoli_bullet', 'assets/Broccoli_2.png');
	this.load.image('bullet', 'assets/bullet6.png');
    this.load.image('target', 'assets/ball.png');
    this.load.image('background', 'assets/moon_surface.png');
}

function create ()
{
    // Set world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Add 3 groups for Bullet objects
    playerBulletsCarrots = this.physics.add.group({ classType: BulletC, runChildUpdate: true });
	playerBulletsBroccoli = this.physics.add.group({ classType: BulletB, runChildUpdate: true });
    enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    // Add background player, enemy, reticle, healthpoint sprites
    var background = this.add.image(800, 600, 'background');
    player = this.physics.add.sprite(800, 600, 'player_handgun');
    enemy = this.physics.add.sprite(300, 600, 'player_handgun');
    reticle = this.physics.add.sprite(800, 700, 'target');
    hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
    hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
    hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);
	
	enemys = this.physics.add.group();
	enemys.create(400, 500, 'player_handgun').setOrigin(0.5, 0.5).setDisplaySize(123, 120).setCollideWorldBounds(true);

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
    hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

    // Set sprite variables
    player.health = 3;
    enemy.health = 3;
    enemy.lastFired = 0;

    // Set camera properties
    this.cameras.main.zoom = 0.5;
    this.cameras.main.startFollow(player);

    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    // Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp)
            player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp)
            player.setAccelerationX(0);
    });

    // Fires bullet from player on left click of mouse
    this.input.on('pointerdown', function (pointer, time, lastFired) {
		if (player.active === false)
			return;
		
		if(pointer.rightButtonDown()) {
			
			// Get bullet from Broccoli bullets group
			var bullet = playerBulletsBroccoli.get().setActive(true).setVisible(true);

			if (bullet)
			{
				bullet.fire(player, reticle);
				this.physics.add.collider(enemy, bullet, enemyHitCallbackBroccoli);
				this.physics.add.collider(enemys, bullet, enemyHitCallbackBroccoli);
			}
			
		} else {

			// Get bullet from Carrots bullets group
			var bullet = playerBulletsCarrots.get().setActive(true).setVisible(true);

			if (bullet)
			{
				bullet.fire(player, reticle);
				this.physics.add.collider(enemy, bullet, enemyHitCallbackCarrot);
				this.physics.add.collider(enemys, bullet, enemyHitCallbackCarrot);
			}
		}
    }, this);

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            reticle.x += pointer.movementX;
            reticle.y += pointer.movementY;
        }
    }, this);

}

function enemyHitCallbackCarrot(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        enemyHit.health = enemyHit.health - 1;
        console.log("Enemy hp: ", enemyHit.health);

        // Kill enemy if health <= 0
        if (enemyHit.health <= 0)
        {
           enemyHit.setActive(false).setVisible(false);
        }

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

function enemyHitCallbackBroccoli(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        // enemyHit.health = enemyHit.health - 1;
        console.log("Enemy hp: ", enemyHit.health);

        enemyHit.x += 20;
		enemyHit.y += 20;

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

function playerHitCallback(playerHit, bulletHit)
{
    // Reduce health of player
    if (bulletHit.active === true && playerHit.active === true)
    {
        playerHit.health = playerHit.health - 1;
        console.log("Player hp: ", playerHit.health);

        // Kill hp sprites and kill player if health <= 0
        if (playerHit.health == 2)
        {
            hp3.destroy();
        }
        else if (playerHit.health == 1)
        {
            hp2.destroy();
        }
        else
        {
            hp1.destroy();
            // Game over state should execute here
        }

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

function enemyFire(enemy, player, time, gameObject)
{
    if (enemy.active === false)
    {
        return;
    }

    if ((time - enemy.lastFired) > 1000)
    {
        enemy.lastFired = time;

        // Get bullet from bullets group
        var bullet = enemyBullets.get().setActive(true).setVisible(true);

        if (bullet)
        {
            bullet.fire(enemy, player);
            // Add collider between bullet and player
            gameObject.physics.add.collider(player, bullet, playerHitCallback);
        }
    }
}

// Ensures sprite speed doesnt exceed maxVelocity while update is called
function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

// Ensures reticle does not move offscreen
function constrainReticle(reticle)
{
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
}

function update (time, delta)
{
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

    //Make reticle move with player
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;

    // Constrain velocity of player
    constrainVelocity(player, 500);

    // Constrain position of constrainReticle
    constrainReticle(reticle);

    // Make enemy fire
    // enemyFire(enemy, player, time, this);
}