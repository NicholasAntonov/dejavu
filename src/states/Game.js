/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Car from '../sprites/Car'
import Road from '../sprites/Road'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        const bannerText = 'DejaVu'
        let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
        banner.font = 'Bangers'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#77BFA3'
        banner.smoothed = false
        banner.anchor.setTo(0.5)

        game.world.setBounds(0, 0, 5000, 5000);

        this.mushroom = new Mushroom({
            game: this,
            x: this.world.centerX,
            y: this.game.height-40,
            asset: 'mushroom',
        });

        this.road = new Road({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'roadtest',
        });

        var startpoint = this.road.getPointOnTrack(0);

        this.car = new Car({
            game: this,
            x: startpoint.x,
            y: startpoint.y,
            asset: 'car',
        });

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.game.add.existing(this.road);
        this.game.add.existing(this.mushroom);
        this.game.add.existing(this.car);
        this.road.initialize();
        this.car.initialize();

        this.car.body.rotation = startpoint.a;
    }

    update () {
        game.camera.x = this.car.x - game.width/2;
        game.camera.y = this.car.y - game.height/2;
    }

    render () {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.car, 32, 32)
        }
    }
}
