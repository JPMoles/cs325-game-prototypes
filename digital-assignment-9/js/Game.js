
let finalScore = 0;
export {finalScore};

export class Game extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super('Game');

        // Create your own variables.
        // this.bouncy = null;

        this.background;
        this.player;
        this.chickens;
        this.groundMounds;
        this.plantsObjects;
        this.seeds;
        this.seedSelected;
        this.seedSelectionImage;
        this.lastTime;
        this.timerText;
        this.timeRemaining;
        this.score;
        this.scoreText;
        this.timer;
        this.roundNumber;
        this.roundNumberText;
        this.chickenSpawn;
        this.numChickens;
        this.moveVelocity = 80;
        this.wateredGround;
        this.plants = new Array(80);
        this.groundWatered = new Array(80);
        this.waterSound;
        this.seedSound;
        this.roundSound;
        this.plantSound;
        this.chickenSound;
        this.growthTimer;
        this.gameMusic;

        this.arrayX = [0, 64, 128, 192, 256, 320, 384, 448, 512, 576];
        this.arrayY = [0, 64, 128, 192, 256, 320, 384, 448];

    }

    preload() {
        this.load.image("Seeds1", "assets/seeds1.png");
        this.load.image("Seeds2", "assets/seeds2.png");
        this.load.image("Seeds3", "assets/seeds3.png");
        this.load.image("SeedSelection", "assets/seed_selection.png");
        this.load.image("wateringPail", "assets/watering_pail.png");
        this.load.image("player_up", "assets/character_temp_back.png");
        this.load.image("player_left", "assets/character_temp_left_test.png");
        this.load.image("player_right", "assets/character_temp_right_test.png");
        this.load.image("chicken2", "assets/chicken_temp_2.png");
        //this.load.spritesheet("chicken_anim", "assets/chicken_animation.png", { frameWidth: 64, frameHeight: 64 });
        this.load.image("watered_ground", "assets/watered_tile.png");
        this.load.image("base_plant", "assets/basic_plant.png");
        this.load.image("base_plant_2", "assets/basic_plant_2.png");
        this.load.image("final_plant_base", "assets/final_plant_base.png");
        this.load.image("final_plant_blue", "assets/final_plant_blue.png");
        this.load.image("final_plant_green", "assets/final_plant_green.png");
        this.load.image("final_plant_rainbow", "assets/final_plant_rainbow.png");
        this.load.image("static_menu", "assets/static_menu.png");
        this.load.audio("watering", "assets/splash1.mp3");
        this.load.audio("shake_seeds", "assets/shaking_seeds.mp3");
        this.load.image("player_front_2", "assets/character_temp_front2.png");
        this.load.audio("roundBell", "assets/ding.mp3");
        this.load.audio("pop", "assets/pop.mp3");
        this.load.audio("cluck", "assets/chicken_clucking.mp3");
        this.load.audio("takeatrip", "assets/takeatrip.mp3");
    }

    create() {
        /*
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'logo' );
        
        // Make it bounce off of the world bounds.
        this.bouncy.body.collideWorldBounds = true;
        
        // Make the camera shake when clicking/tapping on it.
        this.bouncy.setInteractive();
        this.bouncy.on( 'pointerdown', function( pointer ) {
            // In the callback, `this` is `bouncy`. Access the scene with `this.scene`
            // or pass a `this` parameter to `.on()`.
            this.scene.quitGame();
            },
            // Optional: Pass a `this` parameter for the callback. The default is `bouncy`.
            // this
            );
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        text.setOrigin( 0.5, 0.0 );
        */

        this.background = this.add.image(0, 0, 'farm_background').setOrigin(0);

        this.wateredGround = this.physics.add.group();
        this.wateredGround.setDepth(1);

        this.plantsObjects = this.physics.add.group();
        this.plantsObjects.setDepth(2);

        this.player = this.physics.add.sprite(256, 256, 'player').setOrigin(0);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(5);

        //this.physics.add.overlap(this.player, this.plantsObjects, this.playerPickupPlant, null, this);


        this.initGroundWatered();
        this.initPlants();

        this.input.keyboard.on('keydown-ESC', () => {
            this.quitGame();
        });

        this.input.keyboard.on('keydown-G', () => {
            this.scene.start("Scoreboard");
        });

        this.add.image(560 , 524, 'Seeds1').setOrigin(0);
        this.add.image(483, 524, 'Seeds2').setOrigin(0);
        this.add.image(406, 524, 'Seeds3').setOrigin(0);

        // Initially Seeds3 is selected
        this.seedSelectionImage = this.add.image(403, 521, 'SeedSelection').setOrigin(0);
        this.selectSeed1();

        this.input.keyboard.on('keydown-ONE', () => {
            this.selectSeed1();
        });
        this.input.keyboard.on('keydown-TWO', () => {
            this.selectSeed2();
        });
        this.input.keyboard.on('keydown-THREE', () => {
            this.selectSeed3();
        });

        this.add.image(326, 524, 'wateringPail').setOrigin(0);


        this.input.keyboard.on('keydown-P', () => {
            // water plant in front of you if it exists
            this.waterGround();
        });

        this.input.keyboard.on('keydown-I', () => {
            // plant seed on tile you are standing on
            this.plantSeeds();
        });

        this.input.keyboard.on('keyup-O', () => {
            this.pickUpPlant();
        });

        this.input.keyboard.on('keydown-W', () => {
            this.moveNorth();
        });
        this.input.keyboard.on('keyup-W', () => {
            this.stopMoveNorth();
        });
        this.input.keyboard.on('keydown-S', () => {
            this.moveSouth();
        });
        this.input.keyboard.on('keyup-S', () => {
            this.stopMoveSouth();
        });
        this.input.keyboard.on('keydown-A', () => {
            this.moveWest();
        });
        this.input.keyboard.on('keyup-A', () => {
            this.stopMoveWest();
        });
        this.input.keyboard.on('keydown-D', () => {
            this.moveEast();
        });
        this.input.keyboard.on('keyup-D', () => {
            this.stopMoveEast();
        });

        this.chickenSpawn = false;
        this.timer = 0;
        this.lastTime = 0;
        this.timeRemaining = 30;
        this.timerText = this.add.text(20, 524, "Time Remaining - 0:30", { fontSize: "20px", color: "#333" });

        this.scoreText = this.add.text(20, 544, "Score: 0", { fontSize: "20px", color: "#333" });

        // 5 rounds, with increasing numbers of chickens
        // Each round more chickens come
        // Plants grow with time
        // Collect the plants before the chickens get to them

        // Chickens run from left to right and eat plants they run into
        // they don't eat multiple fully grown plants?
        // they will eat lots of smaller plants

        this.roundNumber = 1;
        this.roundNumberText = this.add.text(20, 564, "Round: 1", { fontSize: "20px", color: "#333" });

        this.chickens = this.physics.add.group();
        this.chickens.setDepth(3);
        //this.chickens.setDepth(2);
        this.numChickens = 0;

        this.anims.create({ key: 'chicken_walk', frames: this.anims.generateFrameNumbers('chicken_anim'), frameRate: 2 });

        this.menu = this.physics.add.staticImage(0, 512, 'static_menu').setOrigin(0).refreshBody();
        this.physics.add.collider(this.player, this.menu);

        this.waterSound = this.sound.add('watering', {volume: 0.1});
        this.seedSound = this.sound.add('shake_seeds', {volume: 0.1});
        this.roundSound = this.sound.add('roundBell', {volume: 0.1});
        this.plantSound = this.sound.add('pop', {volume: 0.1});
        this.chickenSound = this.sound.add('cluck', {volume: 0.1});
        this.gameMusic = this.sound.add('takeatrip', {volume: 0.05});

        this.growthTimer = 0;
        this.score = 0;

        //this.physics.add.overlap(this.player, this.plantsObjects, this.playerPickupPlant, null, this);
        this.physics.add.overlap(this.chickens, this.plantsObjects, this.chickenEatPlant, null, this);

        this.gameMusic.play();
        this.gameMusic.setLoop(true);
    }

    pickUpPlant() {

        let {x, y} = this.getPlayerTile();

        let {xMultiple, yMultiple} = this.getPlayerIndex();

        if(this.isPlantFullyGrown(x, y)) {
            let plant = this.plants[xMultiple + (yMultiple * 10)];

            if(plant.seedType === 1)
                this.score += 8;
            else if(plant.seedType === 2)
                this.score += Phaser.Math.Between(4, 12);
            else
                this.score += Phaser.Math.Between(1, 15);

            this.plantSound.play();
            this.scoreText.setText("Score: " + this.score);
            // set plant info object to null
            this.plants[xMultiple + (yMultiple * 10)] = null;

            // find plant in this.plantObjects
            let j;
            let plantsList = this.plantsObjects.getChildren();
            for(j = 0; j < plantsList.length; j++) {
                if(plantsList[j].x === x && plantsList[j].y === y) {
                    this.plantsObjects.killAndHide(plantsList[j]);
                }
            }

            // also set ground array to false
            this.groundWatered[xMultiple + (yMultiple * 10)] = false;
            // destroy ground tile in that area
            let i;
            let groundWateredTiles = this.wateredGround.getChildren();
            for(i = 0; i < groundWateredTiles.length; i++) {
                if(groundWateredTiles[i].x === x && groundWateredTiles[i].y === y) {
                    this.wateredGround.killAndHide(groundWateredTiles[i]);
                }
            }

        }

    }

    removePlant(x, y) {
        // set plant info object to null
        this.plants[x + (y * 10)] = null;

        let xPos = x * 64, yPos = y * 64;

        // find plant in this.plantObjects
        let i;
        let plantsList = this.plantsObjects.getChildren();
        for(i = 0; i < plantsList.length; i++) {
            if(plantsList[i].x === xPos && plantsList[i].y === yPos) {
                this.plantsObjects.killAndHide(plantsList[i]);
            }
        }
    }

    /*
    playerPickupPlant(player, plant) {

        // console.log("Made overlap!");

        let x = plant.x;
        let y = plant.y;

        let {xMultiple, yMultiple} = this.getIndex(x, y);

        if(this.isPlantFullyGrown(x, y)) {
            if(plant.seedType == 1)
                this.score += 8;
            else if(plant.seedType == 2)
                this.score += Phaser.Math.Between(4, 12);
            else
                this.score += Phaser.Math.Between(1, 15);

            this.scoreText.setText("Score: " + this.score);
            this.plants[xMultiple + (yMultiple * 10)] = null;
            plant.disableBody(true, true);

            // also set ground array to false
            this.groundWatered[xMultiple + (yMultiple * 10)] = false;
            // destroy ground tile in that area
            let i;
            let groundWateredTiles = this.wateredGround.getChildren();
            for(i = 0; i < groundWateredTiles.length; i++) {
                if(groundWateredTiles[i].x == plant.x && groundWateredTiles[i].y == plant.y) {
                    this.wateredGround.killAndHide(groundWateredTiles[i]);
                }
            }

        }
    }
    */

    isPlantFullyGrown(x, y) {
        let xIndex = Math.floor(x / 64);
        let yIndex = Math.floor(y / 64);
        return this.plants[xIndex + (yIndex * 10)] != null && this.plants[xIndex + (yIndex *10)].stage === 3;
    }

    initGroundWatered() {
        let i;
        for(i = 0; i < this.groundWatered.length; i++) { // to set a value x + (y * 10)
            this.groundWatered[i] = false;
        }
    }

    initPlants() {
        let i;
        for(i = 0; i < this.plants.length; i++) {
            this.plants[i] = null;
        }
    }

    waterGround() {

        let x;
        let y;

        // determine position of player
        let xMultiple = Math.floor((this.player.x+32) / 64);
        let yMultiple = Math.floor((this.player.y+32) / 64);

        let xPosition = this.arrayX[xMultiple];
        let yPosition = this.arrayY[yMultiple];

        x = xPosition;
        y = yPosition;

        // Check if farm tile and if already watered, make object to hold that data? could hold the sprite
        // determine direction facing
        // if on tile/facing ground tile

        if(this.isGroundTile(x, y) && !this.isGroundWatered(x, y)) {
            // play water sound here
            this.waterSound.play();
            this.wateredGround.create(x, y, 'watered_ground').setOrigin(0);
            this.plantsObjects.setDepth(2);
            this.groundWatered[xMultiple + (yMultiple * 10)] = true;
        }

    }

    getPlayerTile() {

        let x;
        let y;

        let xMultiple = Math.floor((this.player.x+32) / 64);
        let yMultiple = Math.floor((this.player.y+32) / 64);

        let xPosition = this.arrayX[xMultiple];
        let yPosition = this.arrayY[yMultiple]; // could also multiply by 64 here

        x = xPosition;
        y = yPosition;

        return {x, y};
    }

    getIndex(x, y) {
        let xMultiple = Math.floor(x / 64);
        let yMultiple = Math.floor(y / 64);

        return {xMultiple, yMultiple};
    }

    getPlayerIndex() {
        let xMultiple = Math.floor((this.player.x+32) / 64);
        let yMultiple = Math.floor((this.player.y+32) / 64);

        return {xMultiple, yMultiple};
    }

    plantSeeds() {

        // Need to check I am on open ground
        let { x, y } = this.getPlayerTile();
        console.log("X: " + x + " Y: " + y);

        let { xMultiple, yMultiple } = this.getIndex(x, y);
        console.log("xIndex: " + xMultiple + " yIndex: " + yMultiple);

        // Need to check seeds not planted already
        console.log("Is ground tile: " + this.isGroundTile(x, y) + " Is seed planted: " + !this.isSeedPlanted(x, y));
        if(this.isGroundTile(x, y) && !this.isSeedPlanted(x, y)) {
            //console.log("got here!");
            this.seedSound.play();
            this.plantsObjects.setDepth(2);
            let plant = this.plantsObjects.create(x, y, 'base_plant').setOrigin(0);
            this.plants[xMultiple + (yMultiple * 10)] = new Plant(plant, xMultiple, yMultiple, this.growthTimer + 8, this.growthTimer, 0, this.seedSelected);
        }
    }

    isGroundTile(x, y) {
        return (x === 64 || x === 192 || x === 320 || x === 448) && (y !== 0 && y !== 448);
    }

    isSeedPlanted(x, y) {
        let xIndex = Math.floor(x / 64);
        let yIndex = Math.floor(y / 64);
        return this.plants[xIndex + (yIndex * 10)] !== null;
    }

    isGroundWatered(x, y) {
        let xIndex = Math.floor(x / 64);
        let yIndex = Math.floor(y / 64);
        return this.groundWatered[xIndex + (yIndex * 10)];
    }

    moveNorth() {
        this.player.setTexture('player_up');
        this.player.setVelocityX(0);
        this.player.setVelocityY(-this.moveVelocity);
    }

    stopMoveNorth() {
        this.player.setVelocityY(0);
    }

    moveSouth() {
        this.player.setTexture('player');
        this.player.setVelocityX(0);
        this.player.setVelocityY(this.moveVelocity);
    }

    stopMoveSouth() {
        this.player.setVelocityY(0);
    }

    moveEast() {
        this.player.setTexture('player_right');
        this.player.setVelocityX(this.moveVelocity);
        this.player.setVelocityY(0);
    }

    stopMoveEast() {
        this.player.setVelocityX(0);
    }

    moveWest() {
        this.player.setTexture('player_left');
        this.player.setVelocityX(-this.moveVelocity);
        this.player.setVelocityY(0);
    }

    stopMoveWest() {
        this.player.setVelocityX(0);
    }

    selectSeed3() {
        this.seedSelectionImage.setPosition(557, 521);
        this.seedSelected = 3;
    }

    selectSeed2() {
        this.seedSelectionImage.setPosition(480, 521);
        this.seedSelected = 2;
    }

    selectSeed1() {
        this.seedSelectionImage.setPosition(403, 521);
        this.seedSelected = 1;
    }

    update(time, delta) {
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );

        if(this.roundNumber === 6) {
            finalScore = this.score;
            this.gameMusic.stop();
            this.gameMusic.destroy();
            this.scene.start("Scoreboard")
        }

        this.timer += delta;
        if(this.timer > 1000) { // one second has passed

            if(!this.chickenSpawn) {
                this.timeRemaining--;
                if (this.timeRemaining >= 0) {
                    this.timerText.setText("Time Remaining - 0:" + this.timeRemaining);
                }
                if(this.timeRemaining <= 0) {
                    this.chickenSpawn = true;
                    this.roundSound.play();
                }

                this.growthTimer++;
                this.updatePlants();
            }

            // update plants growth (base, stage 1, stage 2, collect)
            // check if plants are on watered ground
            // once they are grown and collected the ground is no longer watered
            // update score on collection (maybe callback from player collision?)


            if(this.chickenSpawn) {
                // Spawn chickens

                this.player.setVelocity(0, 0);
                this.player.setTexture('player_front_2');

                this.input.keyboard.enabled = false;
                this.spawnChickens();

                if(!this.chickenSpawn) {
                    this.roundNumber++;
                    this.roundNumberText.setText("Round: " + this.roundNumber);
                    this.timeRemaining = 30;
                    this.timer = 1000;
                    //this.chickenSpawn = false;
                    this.input.keyboard.enabled = true;
                    this.numChickens = 0;
                }
            }


            this.timer -= 1000;
        }


        console.log("Grow timer: " + this.growthTimer);
    }

    updatePlants() {

        // loop through plants array and check if timeTillGrowth has been reach and isWatered
        // then set stage to stage + 1 % 3, set timeTillGrowth = this.growthTimer + random value
        let i;
        for(i = 0; i < this.plants.length; i++) {
            if(this.plants[i] != null) {
                let plant = this.plants[i];
                if(this.growthTimer >= plant.timeTillGrowth && this.isGroundWatered(plant.x * 64, plant.y * 64)) {
                    if (plant.stage < 3) {
                        plant.stage++;
                    }
                    switch(plant.stage) {
                        case 0:
                            plant.plantObject.setTexture("base_plant");
                            break;
                        case 1:
                            plant.plantObject.setTexture("base_plant_2");
                            break;
                        case 2:
                            plant.plantObject.setTexture("final_plant_base");
                            break;
                        case 3:
                            if(plant.seedType === 1) {
                                plant.plantObject.setTexture("final_plant_blue");
                            } else if(plant.seedType === 2) {
                                plant.plantObject.setTexture("final_plant_green");
                            } else { // type 3
                                plant.plantObject.setTexture("final_plant_rainbow");
                            }

                            break;
                    }
                    plant.timeTillGrowth = this.growthTimer + Phaser.Math.Between(3, 8);
                }
            }
        }
    }


    spawnChickens() {

        if(this.numChickens < this.roundNumber) {
            let chicken = this.chickens.create(-64, Phaser.Math.Between(0, 7) * 64, 'chicken').setOrigin(0).setVelocityX(55);
            //chicken.setCollideWorldBounds(true);
            //chicken.body.onWorldBounds = true;
            /*this.physics.world.on('worldbounds', () => {
                console.log('chicken hitting wall')
                // chicken.destroy()
            });
            */

            this.chickenSound.play();
            chicken.play({ key: 'chicken_walk', repeat: -1 });
            this.numChickens++;
        }

        //this.chickens.playAnimation();

        let i;
        let chickenGroup = this.chickens.getChildren();
        for(i = 0; i < chickenGroup.length; i++) {
            if(chickenGroup[i].x > 640) {
                this.chickens.killAndHide(chickenGroup[i]);
                //chickenGroup[i].destroy();
            }
        }

        console.log("Number of active chickens: " + this.chickens.countActive());
        if(this.chickens.countActive() === 0) {
            this.chickens.clear();
            this.chickenSpawn = false; // set this.chickenSpawn = false to stop only updating chickens, and move to next round
            this.player.setTexture('player');
        }

    }

    chickenEatPlant(chicken, plant) {

        // get coordinates of overlap
        let {xMultiple, yMultiple} = this.getIndex(plant.x, plant.y);

        // compare to plants y coordinate and only delete if the same
        if(chicken.y === plant.y) { // make sure on the same row

            // remove plant from array (set to null)
            // this.plants[x + (y * 10)] = null;

            // delete gameobject/physics object
            this.removePlant(xMultiple, yMultiple);

            // don't need to delete water, because it should stay
        }

    }

    quitGame() {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.scene.start( 'MainMenu' );
    }

}

class Plant {

    constructor(plant, xIndex, yIndex, timeTillGrowth, timerStart, stage, seedType) {
        this.plantObject = plant;
        this.x = xIndex;
        this.y = yIndex;
        this.timeTillGrowth = timeTillGrowth;
        this.timerStart = timerStart;
        this.stage = stage;
        this.seedType = seedType;
    }

}

export default Game;