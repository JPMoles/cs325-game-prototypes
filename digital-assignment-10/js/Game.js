
let finalScore = 0;
export {finalScore};

export class Game extends Phaser.Scene {

    constructor() {
        super('Game');
        this.player = null;
        this.lastShot = 0;
        this.timePast = 0;
    }

    preload() {

        // this.load.image("sprBg0", "assets/space/sprBg0.png");
        // this.load.image("sprBg1", "assets/space/sprBg1.png");
        this.load.spritesheet("sprExplosion", "assets/space/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("sprEnemy0", "assets/space/sprEnemy0-fixed.png", {
            frameWidth: 16,
            frameHeight: 17
        });
        this.load.image("sprEnemy1", "assets/space/sprEnemy1.png");
        this.load.spritesheet("sprEnemy2", "assets/space/sprEnemy2-fixed.png", {
            frameWidth: 16,
            frameHeight: 17
        });
        this.load.image("sprLaserEnemy0", "assets/space/sprLaserEnemy0.png");
        this.load.image("sprLaserPlayer", "assets/space/sprLaserPlayer.png");
        this.load.spritesheet("sprPlayer", "assets/space/sprPlayer.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("sndExplode0", "assets/space/sndExplode0.wav");
        this.load.audio("sndExplode1", "assets/space/sndExplode1.wav");
        this.load.audio("sndLaser", "assets/space/sndLaser.wav");
        this.load.audio("boostSound", "assets/boostSound.mp3");
        this.load.image("heart", "assets/heart-fixed.png");

    }

    create() {
        finalScore = 0;

        this.scoreText = this.add.text(20, 20, "Score: " + finalScore);

        this.anims.create({
            key: "sprEnemy0",
            frames: this.anims.generateFrameNumbers("sprEnemy0"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "sprEnemy2",
            frames: this.anims.generateFrameNumbers("sprEnemy2"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "sprPlayer",
            frames: this.anims.generateFrameNumbers("sprPlayer"),
            frameRate: 20,
            repeat: -1
        });

        this.sfx = {
            explosions: [
                this.sound.add("sndExplode0", { volume: 0.1 }),
                this.sound.add("sndExplode1", { volume: 0.1 })
            ],
            laser: this.sound.add("sndLaser", { volume: 0.02}),
            boost: this.sound.add("boostSound", { volume: 0.2})
        };

        this.backgrounds = [];
        for (let i = 0; i < 5; i++) { // create five scrolling backgrounds
            let bg = new ScrollingBackground(this, "sprBg0", i * 10);
            this.backgrounds.push(bg);
        }

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer"
        );

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();

        this.input.keyboard.on("keydown-D", () => {
            if(this.player.rightClicked === 0 && (this.player.lastBootRight + 2000) < this.getTime()) {
                this.player.rightClicked = this.getTime();
                return;
            }

            let elapsed = this.getTime() - this.player.rightClicked;

            if(elapsed < 1000) {
                console.log("double clicked right");
                //this.player.body.velocity.y = 0;
                this.player.body.velocity.x = 5000;
                this.player.body.velocity.y = Math.floor(this.player.body.velocity.y/2);
                this.player.lastBootRight = this.getTime();
                this.sfx.boost.play();
            }

            this.player.rightClicked = 0;

        });

        this.input.keyboard.on("keydown-A", () => {
            if(this.player.leftClicked === 0 && (this.player.lastBoostLeft + 2000) < this.getTime()) {
                this.player.leftClicked = this.getTime();
                return;
            }

            let elapsed = this.getTime() - this.player.leftClicked;

            if(elapsed < 1000) {
                console.log("double clicked left");
                //this.player.body.velocity.y = 0;
                this.player.body.velocity.x = -5000;
                this.player.body.velocity.y = Math.floor(this.player.body.velocity.y/2);
                this.player.lastBoostLeft = this.getTime();
                this.sfx.boost.play();
            }

            this.player.leftClicked = 0;

        });

        /*
        this.input.on("pointerdown", () => {
            let currentTime = this.getTime();
            if(currentTime - this.lastShot > 1000) { // can shoot every 1 second
                let laser = new PlayerLaser(this, this.player.x, this.player.y);
                this.playerLasers.add(laser);
                this.sfx.laser.play();
                this.lastShot = currentTime;
            }
        });
        */

        this.time.addEvent({
            delay: 2000,
            callback: function() {
                let enemy = null;

                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new GunShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                } else if (Phaser.Math.Between(0, 10) >= 5) {
                    if (this.getEnemiesByType("ChaserShip").length < 3) {

                        enemy = new ChaserShip(
                            this,
                            Phaser.Math.Between(0, this.game.config.width),
                            0
                        );
                    }
                } else {
                    enemy = new CarrierShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                }

                if (enemy !== null) {
                    enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
                    this.enemies.add(enemy);
                }
            },
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                }

                enemy.explode(true);
                playerLaser.destroy();
                finalScore += 5;
            }
        });

        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
                player.lives--;
                player.scene.removeLive();
                if(player.lives <= 0) {
                    player.explode(false);
                    player.onDestroy();
                }
                enemy.explode(true);
            }
        });

        this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
            if (!player.getData("isDead") &&
                !laser.getData("isDead")) {
                player.lives--;
                player.scene.removeLive();
                if(player.lives <= 0) {
                    player.explode(false);
                    player.onDestroy();
                }
                laser.destroy();
            }
        });

        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBounce(0.3);

        this.hearts = this.physics.add.group({
            key: 'heart',
            repeat: 2,
            setXY: { x: 390, y: 610, stepX: 35 }
        });

    }

    removeLive() {
        let smallestIndex = 0;
        let heartArray = this.hearts.getChildren();
        for(let i = 0; i < heartArray.length; i++) {
            if(heartArray[i].x < heartArray[smallestIndex].x) {
                smallestIndex = i;
            }
        }
        if(heartArray.length > 0) { // has something in it
            heartArray[smallestIndex].destroy();
        }
    }

    getTime() {
        let d = new Date();
        return d.getTime();
    }

    getEnemiesByType(type) {
        let arr = [];
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];
            if (enemy.getData("type") == type) {
                arr.push(enemy);
            }
        }
        return arr;
    }

    update(time, delta) {

        this.timePast += delta;

        if(!this.player.getData("isDead")) {
            this.player.update();

            /*
            // Player movement
            if (this.keyW.isDown) {
                this.player.moveUp();
            }
            if (this.keyS.isDown) {
                this.player.moveDown();
            }

            if (this.keyA.isDown) {
                this.player.moveLeft();
            }
            if (this.keyD.isDown) {
                this.player.moveRight();
            }
            */

            this.physics.accelerateToObject( this.player, this.input.activePointer, 150, 150, 200);

            // Player shooting

            if (this.keySpace.isDown) {
                this.player.setData("isShooting", true);
            } else {
                //this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
                this.player.setData("isShooting", false);
            }
        }


        // Update enemies
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];

            enemy.update();
            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {

                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.destroy();
                }
            }
            this.scoreText.setText("Score: " + finalScore);
        }

        // Update enemy lazers
        for (let i = 0; i < this.enemyLasers.getChildren().length; i++) {
            let laser = this.enemyLasers.getChildren()[i];
            laser.update();

            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }

        // Update player lazers
        for (let i = 0; i < this.playerLasers.getChildren().length; i++) {
            let laser = this.playerLasers.getChildren()[i];
            laser.update();

            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }

        // Update scrolling background
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

    }

}

class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }

    explode(canDestroy) {
        if (!this.getData("isDead")) {
            // Set the texture to the explosion image, then play the animation
            this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
            this.play("sprExplosion"); // play the animation

            // pick a random explosion sound within the array we defined in this.sfx in SceneMain
            this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();

            if (this.shootTimer !== undefined) {
                if (this.shootTimer) {
                    this.shootTimer.remove(false);
                }
            }

            this.setAngle(0);
            this.body.setVelocity(0, 0);

            this.on('animationcomplete', function() {

                if (canDestroy) {
                    this.destroy();
                }
                else {
                    this.setVisible(false);
                }

            }, this);

            this.setData("isDead", true);
        }
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player");
        this.setData("speedX", 200);
        this.setData("speedY", 150);
        this.play("sprPlayer");
        this.setData("isShooting", false);
        this.setData("timerShootDelay", 50);
        this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
        this.rightClicked = 0;
        this.leftClicked = 0;
        this.lastBootRight = 0;
        this.lastBoostLeft = 0;
        this.lives = 3;
    }

    moveUp() {
        this.body.velocity.y = -this.getData("speedY");
    }

    moveDown() {
        this.body.velocity.y = this.getData("speedY");
    }

    moveLeft() {
        this.body.velocity.x = -this.getData("speedX");
    }

    moveRight() {
        this.body.velocity.x = this.getData("speedX");
    }

    update() {
        //this.body.setVelocity(0, 0);

        //this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        //this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);


        if (this.getData("isShooting")) {
            if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
                this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
            }
            else { // when the "manual timer" is triggered:
                let laser = new PlayerLaser(this.scene, this.x, this.y);
                this.scene.playerLasers.add(laser);

                this.scene.sfx.laser.play(); // play the laser sound effect
                this.setData("timerShootTick", 0);
            }
        }

    }

    onDestroy() {
        this.scene.time.addEvent({ // go to score scene
            delay: 1000,
            callback: function() {
                this.scene.scene.start("ScoreScreen");
            },
            callbackScope: this,
            loop: false
        });
    }

}

class ChaserShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy1", "ChaserShip");
        this.body.velocity.y = Phaser.Math.Between(50, 100)
        this.states = {
            MOVE_DOWN: "MOVE_DOWN",
            CHASE: "CHASE"
        };
        this.state = this.states.MOVE_DOWN;
    }

    update() {
        if (!this.getData("isDead") && this.scene.player) {
            if (Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.scene.player.x,
                this.scene.player.y
            ) < 320) {

                this.state = this.states.CHASE;
            }

            if (this.state == this.states.CHASE) {
                let dx = this.scene.player.x - this.x;
                let dy = this.scene.player.y - this.y;

                let angle = Math.atan2(dy, dx);

                let speed = 100;
                this.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );

                if (this.x < this.scene.player.x) {
                    this.angle -= 5;
                }
                else {
                    this.angle += 5;
                }
            }
        }
    }
}

class GunShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy0", "GunShip");
        this.play("sprEnemy0");
        this.body.velocity.y = Phaser.Math.Between(50, 100);

        this.shootTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: function() {
                let laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y
                );
                laser.setScale(this.scaleX);
                this.scene.enemyLasers.add(laser);
            },
            callbackScope: this,
            loop: true
        });
    }

    onDestroy() {
        if(this.shootTimer !== undefined) {
            if(this.shootTimer) {
                this.shootTimer.remove(false);
            }
        }
    }
}

class CarrierShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy2", "CarrierShip");
        this.play("sprEnemy2");
        this.body.velocity.y = Phaser.Math.Between(50, 100);

    }
}

class PlayerLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprLaserPlayer");
        this.body.velocity.y = -220;
    }
}

class EnemyLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprLaserEnemy0");
        this.body.velocity.y = 200;
    }
}

export class ScrollingBackground {
    constructor(scene, key, velocityY) {
        this.scene = scene;
        this.key = key;
        this.velocityY = velocityY;
        this.layers = this.scene.add.group();
        this.createLayers();
    }

    createLayers() {
        for (let i = 0; i < 2; i++) {
            // creating two backgrounds will allow a continuous scroll
            let layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = (layer.displayHeight * i);
            let flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            let flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));
            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.y = this.velocityY;

            this.layers.add(layer);
        }
    }

    update() {
        if (this.layers.getChildren()[0].y > 0) {
            for (let i = 0; i < this.layers.getChildren().length; i++) {
                let layer = this.layers.getChildren()[i];
                layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
            }
        }

    }

}

export default Game;