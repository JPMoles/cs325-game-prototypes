import { ScrollingBackground, finalScore } from "./Game.js";

export default class ScoreScreen extends Phaser.Scene {

    constructor() {
        super('ScoreScreen');
    }

    preload() {

    }

    create() {
        this.add.text(50, 50, "ScoreScreen");

        this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
            fontFamily: 'Arial',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        this.scoreText = this.add.text(this.game.config.width * 0.5, 250, "Final Score: " + finalScore, {
            fontFamily: 'Arial',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.scoreText.setOrigin(0.5);

        this.sfx = {
            btnOver: this.sound.add("sndBtnOver", { volume: 0.1 }),
            btnDown: this.sound.add("sndBtnDown", { volume: 0.1 })
        };

        this.btnRestart = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnRestart"
        );

        this.btnRestart.setInteractive();

        this.btnRestart.on("pointerover", function() {
            this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        }, this);

        this.btnRestart.on("pointerout", function() {
            this.setTexture("sprBtnRestart");
        }, this.btnRestart);

        this.btnRestart.on("pointerdown", function() {
            this.btnRestart.setTexture("sprBtnRestartDown");
            this.sfx.btnDown.play();
        }, this);

        this.btnRestart.on("pointerup", function() {
            this.btnRestart.setTexture("sprBtnRestart");
            this.scene.start("MainMenu");
        }, this);


        this.backgrounds = [];
        for (let i = 0; i < 5; i++) {
            let keys = ["sprBg0", "sprBg1"];
            let key = keys[Phaser.Math.Between(0, keys.length - 1)];
            let bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }


    }

    update() {

        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

    }

}