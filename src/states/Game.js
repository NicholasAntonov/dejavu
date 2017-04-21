/* globals __DEV__ */
import Phaser from 'phaser'
import Car from '../sprites/Car'
import Obstacle from '../sprites/Pickup'
import Road from '../sprites/Road'
import Checkpoint from '../sprites/Checkpoint'
import Mountain from '../sprites/Mountain'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        const bannerText = 'DejaVu'
        let banner = this.add.text(1000, 2200, bannerText)
        banner.font = 'Dejavu Sans'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#FFFFFF'
        banner.smoothed = false
        banner.anchor.setTo(0.5)

        game.world.setBounds(0, 0, 5000, 5000);
        game.stage.backgroundColor = "#001400";

        this.lapcount = 0;
        this.timer = 12;

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
                    this.lapcount += 1;
                    this.timer += 12;
                    if (this.timer > 45) this.timer = 45;
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
                    this.timer += 10;
                    if (this.timer > 45) this.timer = 45;
                }
            }
        });

        this.physics.startSystem(Phaser.Physics.P2JS);
        game.roadCollisions = game.physics.p2.createCollisionGroup();

        game.add.existing(this.road);
        this.road.initialize();

        this.mountain = new Mountain({
            game: this,
            x: this.road.x,
            y: this.road.y,
            asset: null,
            points: this.road.outline.slice(this.road.outline.length/2, this.road.outline.length),
        });

        this.roadtexture = new Phaser.Rope(this.game, 0, 0, 'roadtest', null, this.road.curvednodes)
        game.add.existing(this.roadtexture);

        game.add.existing(this.mountain);

        game.add.existing(this.startline);
        game.add.existing(this.midpoint);

        game.add.existing(this.car);
        this.car.initialize();

        this.car.body.rotation = startpoint.a;

        this.timertext = game.add.text(200, 500, "test");
        this.timertext.font = 'Dejavu Sans';
        this.timertext.fontsize = 70;
        this.timertext.fill = '#FFFFFF';
        this.timertext.anchor.setTo(0.5);
        this.timertext.fixedToCamera = true;
        this.timertext.cameraOffset.setTo(this.game.width/2, 50);

        this.laptext = game.add.text(200, 500, "test");
        this.laptext.font = 'Dejavu Sans';
        this.laptext.fontsize = 70;
        this.laptext.fill = '#FFFFFF';
        this.laptext.anchor.setTo(0);
        this.laptext.fixedToCamera = true;
        this.laptext.cameraOffset.setTo(20, this.game.height - 50);
    }

    update () {
        game.camera.x = this.car.x - game.width/2 || game.camera.x;
        game.camera.y = this.car.y - game.height/2 || game.camera.y;
        this.timer -= this.time.physicsElapsed;
        this.timertext.text = this.timer.toFixed(0);
        this.laptext.text = "Lap: " + this.lapcount.toString();
        if (this.timer <= 0) {
            this.state.start('End');
        }
    }

    render () {
        if (__DEV__) {
            if (this.car) {
                //this.game.debug.spriteInfo(this.car, 32, 32);
            }
        }
    }

    spawnObstacle () {
        var validx, validy;
        var between = (num, min, max) => {
            return (num > min && num < max);
        };

        do {
            var r = Math.random();
            var rx = Math.random()*80 - 40;
            var ry = Math.random()*80 - 40;
            var p = this.road.getPointOnTrack(r);
            validx = p.x + rx;
            validy = p.y + ry;

        } while (
            between(validx, game.camera.x - game.width/2, game.camera.x + game.width/2)
         || between(validy, game.camera.y - game.height/2, game.camera.y + game.width/2)
        );

        const items = [
            'pakij',
            'jetbox',
            'ball',
        ]
        var assetstr = items[Math.floor(Math.random()*items.length)];
        

        // I don't know why these constants are here
        var obstacle = new Obstacle({
            game: this,
            x: validx + 230,
            y: validy + 530,
            asset: assetstr,
        })
        game.add.existing(obstacle);
    }

    endGame () {
        this.state.start('End');
    }
}
