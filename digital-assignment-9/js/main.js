import "./phaser.js";
import MainMenu from "./MainMenu.js";
import Game from "./Game.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 640,
    height: 600,
    scene: [ MainMenu, Game ],
    physics: { default: 'arcade'},
});
