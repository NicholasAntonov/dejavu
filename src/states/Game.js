/* globals __DEV__ */
import Phaser from 'phaser'
import Car from '../sprites/Car'
import Obstacle from '../sprites/Pickup'
import Road from '../sprites/Road'
import Checkpoint from '../sprites/Checkpoint'

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

        this.game.world.setBounds(0, 0, 5000, 5000);
        this.game.stage.backgroundColor = "#6F6F6F";

        this.road = new Road({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: null,
        });

        var startpoint = this.road.getPointOnTrack(0);
        var midpoint = this.road.getPointOnTrack(0.5);

        this.car = new Car({
            game: this,
            x: startpoint.x,
            y: startpoint.y,
            asset: 'car',
        });

        this.startline = new Checkpoint({
            game: this,
            x: startpoint.x,
            y: startpoint.y,
            a: startpoint.a,
            asset: 'startline',
            onHit: (body, bodyB, shapeA, shapeB, equation) => {
                if (bodyB.id === this.car.body.id && this.startline.active === true) {
                    for (var i=0; i < this.startline.passes; i++) {
                        this.spawnObstacle();
                    }
                    this.startline.passes += 1;
                    this.startline.active = false;
                    this.midpoint.active = true;
                }
            }
        });

        this.startline.active = true;

        this.midpoint = new Checkpoint({
            game: this,
            x: midpoint.x,
            y: midpoint.y,
            a: midpoint.a,
            asset: 'checkpoint',
            onHit: (body, bodyB, shapeA, shapeB, equation) => {
                if (bodyB.id === this.car.body.id && this.midpoint.active === true) {
                    for (var i=0; i < this.midpoint.passes; i++) {
                        this.spawnObstacle();
                    }
                    this.midpoint.passes += 1;
                    this.midpoint.active = false;
                    this.startline.active = true;
                }
            }
        });

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.game.add.existing(this.road);
        this.road.initialize();

        this.roadtexture = new Phaser.Rope(this.game, 0, 0, 'roadtest', null, this.road.curvednodes)
        this.game.add.existing(this.roadtexture);

        this.game.add.existing(this.startline);
        this.game.add.existing(this.midpoint);

        this.game.add.existing(this.car);
        this.car.initialize();

        this.car.body.rotation = startpoint.a;
    }

    update () {
        this.game.camera.x = this.car.x - game.width/2;
        this.game.camera.y = this.car.y - game.height/2;
    }

    render () {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.car, 32, 32);
        }
    }

    spawnObstacle () {
        var validx, validy;
        var between = (num, min, max) => {
            return (num > min && num < max);
        };

        do {
            var r = Math.random();
            var rx = Math.random()*40 - 80;
            var ry = Math.random()*40 - 80;
            var p = this.road.getPointOnTrack(r);
            validx = p.x + rx;
            validy = p.y + ry;

        } while (
            between(validx, this.game.camera.x - game.width/2, this.game.camera.x + game.width/2)
         || between(validy, this.game.camera.y - game.height/2, this.game.camera.y + game.width/2)
        );

        const items = [
            'pakij',
            'jetbox',
        ]
        var assetstr = items[Math.floor(Math.random()*items.length)];
        

        // I don't know why these constants are here
        var obstacle = new Obstacle({
            game: this,
            x: validx + 230,
            y: validy + 530,
            asset: assetstr,
        })
        this.game.add.existing(obstacle);
    }
}
