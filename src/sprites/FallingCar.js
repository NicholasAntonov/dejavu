import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset)
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(this.game.game.roadCollisions); // Two games PogChamp
        this.body.collides(this.game.game.roadCollisions);
        this.body.damping = 0.95;
    }

    update () {
        this.scale.setTo(this.scale.x-0.01, this.scale.y-0.01);
        if (this.scale.x < 0.05) {
            this.destroy();
        }
    }

}
