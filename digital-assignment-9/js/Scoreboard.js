import { finalScore } from "./Game.js";

export class Scoreboard extends Phaser.Scene {

    constructor() {
        super('Scoreboard');

        this.score;
        this.chickens;
    }

    preload() {
        this.load.image("menuButton", "assets/menu_button.png");
        this.load.image("menuButton_down", "assets/menu_button_down.png");
        this.load.image("green_background", "assets/green_background.png");
    }

    create() {

        this.add.image(0, 0, "green_background").setOrigin(0);

        this.score = finalScore;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const menuButton = this.add.sprite(screenCenterX, screenCenterY + 100, "menuButton");
        menuButton.setOrigin(0.5, 0.5);

        menuButton.setInteractive().on("pointerover", () => {
            menuButton.setTexture("menuButton_down");
        }).on("pointerout", () => {
            menuButton.setTexture("menuButton");
        }).on('pointerup', () => {
            this.scene.start("MainMenu");
        });

        this.chickens = this.physics.add.group();
        this.chickens.create(100, 100, 'chicken');
        this.chickens.create(150, 150, 'chicken');
        this.chickens.create(400, 400, 'chicken');
        this.chickens.create(600, 500, 'chicken');

        let i;
        for(i = 0; i < 25; i++) {
            this.chickens.create(Phaser.Math.Between(0, 576), Phaser.Math.Between(0, 536), 'chicken').setOrigin(0);
        }

        this.add.text(screenCenterX, screenCenterY, "Final Score: " + this.score, { fontSize: "36px", color: "#000" }).setOrigin(0.5, 0.5);

    }

    update() {

    }

}

export default Scoreboard;