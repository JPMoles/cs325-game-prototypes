export class Game extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super('Game');

        // Create your own variables.
        // this.bouncy = null;

        this.player;
        this.chickens;
        this.groundMounds;
        this.plants;
    }

    preload() {



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

        this.player = this.add.sprite(320, 320, 'player').setOrigin(0);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('Lose');
        });

    }

    update(time, delta) {
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
    }

    quitGame() {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.scene.start( 'MainMenu' );
    }

}

export default Game;