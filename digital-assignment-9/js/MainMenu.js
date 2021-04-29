export class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');

        this.music = null;
        this.playButton = null;
        this.background;

        // delete these and put in Game
        //this.player
        //this.chicken
    }

    preload() {
        this.load.audio('menuMusic', ['assets/music_zapsplat_game_music_childrens_soft_arp_warm_fun_001.mp3']);
        this.load.image('startButtonUp', 'assets/start_button_out.png');
        this.load.image('startButtonDown', 'assets/start_button_in.png');
        this.load.image('testGrid', 'assets/test_grid.png');
        this.load.image('chicken', 'assets/chicken_temp.png');
        this.load.image('player', 'assets/character_temp_front.png');
    }

    create() {

        this.music = this.sound.add('menuMusic', {volume: 0.05});
        this.music.play();

        this.background = this.add.image(0, 0, "testGrid");
        this.background.setOrigin(0, 0);

        //let clickCount = 0;
        //this.clickCountText = this.add.text(100, 200, '');

        //const helloButton = this.add.text(100, 100, "Hello Phaser!", {fill: "#af0"});
        //helloButton.setInteractive({useHandCursor: true});
        //helloButton.on('pointerdown', () => console.log('pointerdown pressed'));

        //this.updateClickCountText(clickCount);

        //const startButton = this.add.text(200, 400, "Start", {fill: "#33ccff"})
        //startButton.setInteractive().on('pointerdown', () => this.scene.start('Game'))

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const startButton2 = this.add.sprite(screenCenterX, screenCenterY + 100, "startButtonUp");
        startButton2.setOrigin(0.5, 0.5);


        startButton2.setInteractive().on("pointerover", () => {
            startButton2.setTexture("startButtonDown");
        }).on("pointerout", () => {
            startButton2.setTexture("startButtonUp");
        }).on('pointerup', () => {
            this.changeScene();
        });

        const titleText = this.add.text(screenCenterX, screenCenterY - 50, 'Chicken Farm',  { fontSize: '50px' });
        titleText.setOrigin(0.5, 0.5)

        //this.player = this.add.sprite(320, 320, 'player').setOrigin(0);

        //this.chicken = this.add.sprite(448, 448, 'chicken').setOrigin(0);
    }

    /*
    updateClickCountText(clickCount) {
        this.clickCountText.setText(`Button has been clicked ${clickCount} times.`);
    }
    */

    changeScene() {
        this.scene.start('Game')
    }

}

export default MainMenu;