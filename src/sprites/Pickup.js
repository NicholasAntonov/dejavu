import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.height = 40;
        this.width = 40;

        this.game.physics.p2.enable(this, false);
        this.body.setCircle(10);
        this.body.mass = 50;
        this.body.damping = 0.98;
    }

    update () {
        var bodies = this.game.physics.p2.hitTest(this.position, [this.game.road.body]);
        if (bodies.length === 0) {
            this.scale.setTo(this.scale.x-0.01, this.scale.y-0.01);
            if (this.scale.x < 0.05) {
                this.destroy();
            }
        }
    }

    onBeginContact() {
    }
}
