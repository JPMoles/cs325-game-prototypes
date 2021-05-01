import "./phaser.js";
import Boot from "./Boot.js";
import MainMenu from "./MainMenu.js";
import Game from "./Game.js";
import ScoreScreen from "./ScoreScreen.js";

/*
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 480,
    height: 640,
    //backgroundColor: "black",
    scene: [ Boot, MainMenu, Game, ScoreScreen ],
    physics: { default: 'arcade' },
    //pixelArt: true,
    //roundPixels: true,
});
*/
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 480,
    height: 640,
    scene: [ MainMenu, Game, ScoreScreen ],
    physics: { default: 'arcade'},
});
