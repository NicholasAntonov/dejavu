import Phaser from 'phaser'
import { increase, decrease } from '../utils'

const SPACEBAR_KEYCODE = 32;

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.velocity = 0;
        this.angularAcceleration = 0;
        this.turningSpeed = 8;
    }

    update () {
        if (game.input.keyboard.isDown(SPACEBAR_KEYCODE)) {
            // DRIFTIO

            if (this.cursors.up.isDown) {
                // this.body.angularVelocity = increase(this.angularAcceleration, this.turningSpeed * (this.velocity/1000));
            } else if (this.cursors.down.isDown) {
                // this.body.angularVelocity = decrease(this.angularAcceleration, this.turningSpeed * (this.velocity/1000));
            }
            this.angularAcceleration = this.body.angularVelocity;

        } else {
            // sad normal driving

            // forward/backward velocity
            if (this.cursors.up.isDown && this.velocity <= 400) {
                this.velocity += 7;
            } else if (this.cursors.down.isDown && this.velocity >= -400) {
                this.velocity -= 7;
            } else {
                this.velocity = increase(this.velocity, -7);
            }

            this.body.velocity.x = this.velocity * Math.cos((this.angle-90)*0.01745);
            this.body.velocity.y = this.velocity * Math.sin((this.angle-90)*0.01745);


            // angular velocity


            if (this.cursors.left.isDown) {
                this.body.angularVelocity = -1 * this.turningSpeed * (this.velocity/1000);
                this.angularAcceleration = this.body.angularVelocity;
            } else if (this.cursors.right.isDown) {
                this.body.angularVelocity = this.turningSpeed * (this.velocity/1000);
                this.angularAcceleration = this.body.angularVelocity;
            } else {
                this.body.angularVelocity = 0;
            }
        }
    }

    initialize () {
        this.game.physics.p2.enable(this, false);
        this.cursors = game.input.keyboard.createCursorKeys();
    }
}
