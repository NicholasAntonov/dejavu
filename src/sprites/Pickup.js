import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.height = 40;
        this.width = 40;

        this.game.physics.p2.enable(this, true);
        this.body.setCircle(10);
        this.body.mass = 100;
    }

    update () {
    }

    onBeginContact() {
    }
}
