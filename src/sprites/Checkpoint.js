import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, a, asset, onHit }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)

        this.game.physics.p2.enable(this, false);
        this.body.onBeginContact.add(onHit, this);
        this.body.data.shapes[0].sensor = true;
        this.body.rotation = a;
        this.passes = 0;
        this.active = false;
    }

    update () {
    }
}
