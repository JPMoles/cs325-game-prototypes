export class Scoreboard extends Phaser.Scene {

    constructor() {
        super('Scoreboard');

        this.score;
        this.chickens;
    }

    preload() {

    }

    create() {

        this.chickens = this.physics.add.group();
        this.chickens.create(100, 100, 'chicken');
        this.chickens.create(150, 150, 'chicken');
        this.chickens.create(200, 200, 'chicken');
        this.chickens.create(400, 400, 'chicken');
    }

    update() {

    }

}

export default Scoreboard;