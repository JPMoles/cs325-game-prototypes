import "./phaser.js";
import MainMenu from "./MainMenu.js";
import Game from "./Game.js";
import Scoreboard from "./Scoreboard.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 640,
    height: 600,
    scene: [ MainMenu, Game, Scoreboard ],
    physics: { default: 'arcade'},
});
