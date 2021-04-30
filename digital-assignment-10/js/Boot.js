import MainMenu from "./MainMenu.js";

export default class Boot extends Phaser.Scene {

    constructor() {
        super('Boot');

        this.timer = 0;
        this.timeToScene = 5;
        this.bootText = null;
    }

    preload() {
        // load stuff needed for menu
        this.load.image("gnome", "assets/gnome.jpg");
    }

    create() {

        this.bootText = this.add.text(50, 50, "Boot Scene", { fontSize: "42px", color: "#fff" });
    }

    update(time, delta) {
        // probably can delete
        this.timer += delta;
        if(this.timer >= 1000) {
            this.timeToScene--;
            this.timer -= 1000;
            this.bootText.setText("Boot Scene " + this.timeToScene);
        }
        if(this.timeToScene <= 0) {
            this.scene.start("MainMenu");
        }
    }

}