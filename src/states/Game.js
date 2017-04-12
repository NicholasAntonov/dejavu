/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Car from '../sprites/Car'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        const bannerText = 'Phaser + ES6 + Webpack'
        let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
        banner.font = 'Bangers'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#77BFA3'
        banner.smoothed = false
        banner.anchor.setTo(0.5)

        this.mushroom = new Mushroom({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'mushroom',
        });

        this.car = new Car({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'car',
        });

        this.physics.startSystem(Phaser.Physics.P2JS);
        /* this.game.add.existing(this.mushroom);*/
        this.game.add.existing(this.car);
        this.car.initialize();
        this.game.physics.p2.enable(this.car);


    }

    update () {

    }

    render () {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.car, 32, 32)
        }
    }
}
