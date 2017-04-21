import Phaser from 'phaser'
import FallingCar from './FallingCar'
import { increase } from '../utils'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.targetvelocity = 0;
        this.angularVelocity = 0;
        this.turningSpeed = 8;
    }

    update () {
        var drifting = this.isDrifting();

        if (this.cursors.up.isDown && this.targetvelocity <= 400) {
            this.targetvelocity += 7;
        } else if (this.cursors.down.isDown && this.targetvelocity >= -400) {
            this.targetvelocity -= 7;
        } else {
            this.targetvelocity = increase(this.targetvelocity, -7);
        }

        if (drifting) {
            var xcomponent = Math.cos((this.angle-90) * 0.01745);
            var ycomponent = Math.sin((this.angle-90) * 0.01745);
            var anglevec = new Phaser.Point(xcomponent, ycomponent).setMagnitude(this.targetvelocity*1.2);
            var currentvec = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);

            anglevec.subtract(currentvec.x, currentvec.y);

            this.body.velocity.x += anglevec.x*0.04;
            this.body.velocity.y += anglevec.y*0.04;

            if (this.cursors.left.isDown) {
                this.body.angularVelocity = -1 * this.turningSpeed * (this.targetvelocity/1200);
            } else if (this.cursors.right.isDown) {
                this.body.angularVelocity = this.turningSpeed * (this.targetvelocity/1200);
            } else {
                this.body.angularVelocity = 0;
            }

        } else {
            // forward/backward velocity
            this.body.velocity.x = this.targetvelocity * Math.cos((this.angle-90)*0.01745);
            this.body.velocity.y = this.targetvelocity * Math.sin((this.angle-90)*0.01745);


            // angular velocity
            if (this.cursors.left.isDown) {
                this.body.angularVelocity = -1 * this.turningSpeed * (this.targetvelocity/3000);
            } else if (this.cursors.right.isDown) {
                this.body.angularVelocity = this.turningSpeed * (this.targetvelocity/3000);
            } else {
                this.body.angularVelocity = 0;
            }
        }

        // Check if car is off the road
        var bodies = this.game.physics.p2.hitTest(this.position, [this.game.road.body]);
        if (bodies.length === 0) {
            var fallingcar = new FallingCar({
                game: this.game,
                x: this.x,
                y: this.y,
                asset: 'car',
            });
            fallingcar.body.velocity.x = this.body.velocity.x;
            fallingcar.body.velocity.y = this.body.velocity.y;
            fallingcar.body.rotation = this.body.rotation;
            this.game.add.existing(fallingcar);
            this.game.time.events.add(3000, this.game.endGame, this.game);
            this.destroy();
        }

    }

    initialize () {
        this.game.physics.p2.enable(this, false);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.body.damping = 0.6;
    }

    isDrifting () {
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.SHIFT)) return true;

        var xcomponent = Math.cos((this.angle-90) * 0.01745);
        var ycomponent = Math.sin((this.angle-90) * 0.01745);
        var anglevec = new Phaser.Point(xcomponent, ycomponent);
        var currentvec = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
        if (currentvec.getMagnitude() < 100) return false;
        currentvec.normalize();

        var portion = anglevec.dot(currentvec);
        if (portion < 0.9) return true;
        else return false;
    }
}
