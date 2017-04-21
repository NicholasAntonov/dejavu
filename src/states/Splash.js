import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)
        //
        // load your assets
        //
        this.load.image('mushroom', 'assets/images/mushroom2.png');
        this.load.image('car', 'assets/images/car.png');
        this.load.image('pakij', 'assets/images/pakij.png');
        this.load.image('jetbox', 'assets/images/tech-demo-box.png');
        this.load.image('roadtest', 'assets/images/road2.png');
        this.load.image('startline', 'assets/images/finishline.png');
        this.load.image('checkpoint', 'assets/images/checkpoint.png');
    }

    create () {
        this.state.start('Game');
        this.physics.startSystem(Phaser.Physics.P2JS);
    }
}
