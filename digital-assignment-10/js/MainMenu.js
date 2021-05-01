import { Game, ScrollingBackground } from "./Game.js";

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image("sprBg0", "assets/space/sprBg0.png");
        this.load.image("sprBg1", "assets/space/sprBg1.png");
        this.load.image("sprBtnPlay", "assets/space/sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "assets/space/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "assets/space/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "assets/space/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/space/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "assets/space/sprBtnRestartDown.png");

        this.load.audio("sndBtnOver", "assets/space/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "assets/space/sndBtnDown.wav");

    }

    create() {

        this.sfx = {
            btnOver: this.sound.add("sndBtnOver", { volume: 0.1 }),
            btnDown: this.sound.add("sndBtnDown", { volume: 0.1 })
        };

        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );

        this.btnPlay.setInteractive();

        this.btnPlay.on("pointerover", function() {
            this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        }, this);
        this.btnPlay.on("pointerout", function() {
            this.setTexture("sprBtnPlay");
        }, this.btnPlay);
        this.btnPlay.on("pointerdown", function() {
            this.btnPlay.setTexture("sprBtnPlayDown");
            this.sfx.btnDown.play();
        }, this);
        this.btnPlay.on("pointerup", function() {
            this.btnPlay.setTexture("sprBtnPlay");
            this.scene.start("Game");
        }, this);


        this.title = this.add.text(this.game.config.width * 0.5, 128, "SPACE SHOOTER", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        this.backgrounds = [];
        for (let i = 0; i < 5; i++) {
            let keys = ["sprBg0", "sprBg1"];
            let key = keys[Phaser.Math.Between(0, keys.length - 1)];
            let bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }


    }

    update(time, delta) {

        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

    }

}