export class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, actionOnClick = () => {}, context, outImage, overImage, downImage) {
        super(scene, x, y, texture);

        // Use Spleen to set different textures?

        // When hovered set to different texture?

        scene.add.existing(this);

        this.actionOnClick = actionOnClick;
        this.outImage = outImage;
        this.overImage = overImage;
        this.downImage = downImage;


        this.button = scene.add.sprite(400, 400, this.outImage);
    }

    create() {



    }

}

export default Button;