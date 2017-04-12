import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.velocity = 0;
    }

    update () {
        const cursors = this.cursors;
        console.log(cursors.up);
        if (cursors.up.isDown && this.velocity <= 400) {
            this.velocity += 7;
        } else if (cursors.down.isDown && this.velocity >= -400) {
            this.velocity -= 7;
        } else if (this.velocity >= 7) {
            this.velocity -= 7;
        }

        this.body.velocity.x = this.velocity * Math.cos((this.angle-90)*0.01745);
        this.body.velocity.y = this.velocity * Math.sin((this.angle-90)*0.01745);

        if (cursors.left.isDown)
            this.body.angularVelocity = -5*(this.velocity/1000);
        else if (cursors.right.isDown)
            this.body.angularVelocity = 5*(this.velocity/1000);
        else
            this.body.angularVelocity = 0;

    }

    initialize () {
        this.game.physics.p2.enable(this, false);
        this.cursors = game.input.keyboard.createCursorKeys();
    }
}
