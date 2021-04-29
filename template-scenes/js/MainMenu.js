import {Button} from './button.js';

export class MainMenu extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'MainMenu' );
        
        this.music = null;
	    this.playButton = null;
	}
    
    create() {

        //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //	Here all we're doing is playing some music and adding a picture and button
        //	Naturally I expect you to do something significantly better :)

        this.music = this.sound.add( 'titleMusic' );
        this.music.play();

        this.add.sprite( 0, 0, 'titlePage' ).setOrigin(0,0);
        
        this.playButton = new Button( this, 400, 300, 'playButton', this.startGame, this, 'over', 'out', 'down' );
    }

    update() {
        //	Do some nice funky main menu effect here
    }
    
    // The callback for the button.
    startGame() {
        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        this.music.stop();

        //	And start the actual game
        this.scene.start( 'Game' );
    }
    
}

export class Preloader extends Phaser.Scene {

    constructor() {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'Preloader' );

        this.background = null;
        this.preloaderBar = null;

        this.ready = false;
    }

    preload() {
        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        this.background = this.add.image( 0,0, 'preloaderBackground' ).setOrigin(0,0);
        this.preloaderBar = this.add.image( this.cameras.main.centerX, this.cameras.main.centerY, 'preloaderBar' );

        //	Crop the `preloaderBar` sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.on( 'progress', function( value ) {
            this.scene.preloaderBar.setCrop( 0, 0, this.scene.preloaderBar.width*value, this.scene.preloaderBar.height );
        });
        this.load.on( 'complete', function() {
            this.scene.preloaderBar.destroy();
        });

        //	Here we load the rest of the assets our game needs.
        //	As this is just a Project Template I've not provided these assets, swap them for your own.
        this.load.image('titlePage', 'assets/title.jpg');
        this.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
        this.load.audio('titleMusic', ['assets/Poppers and Prosecco.mp3']);
        //	+ lots of other required assets here
        this.load.image( 'logo', 'assets/phaser.png' );
    }

    create() {
        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloaderBar.setCrop();
    }

    update() {
        //	You don't actually need to do this, but I find it gives a much smoother game experience.
        //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //	You can jump right into the menu if you want and still play the music, but you'll have a few
        //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //	it's best to wait for it to decode here first, then carry on.

        //	If you don't have any music in your game then put the `this.scene.start()` call in the `create` function and delete
        //	the `update()` function completely.

        if( /* this.cache.isSoundDecoded('titleMusic') && */ this.ready === false )
        {
            this.ready = true;
            this.scene.start('MainMenu');
        }
    }

}
