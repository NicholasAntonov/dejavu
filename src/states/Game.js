/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Car from '../sprites/Car'
import {gameWidth, gameHeight} from '../config.js'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    game.world.setBounds(0, 0, 3000, 3000);
    const bannerText = 'Phaser + ES6 + Webpack';
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText);
    banner.font = 'Bangers';
    banner.padding.set(10, 16);
    banner.fontSize = 40;
    banner.fill = '#77BFA3';
    banner.smoothed = false;
    banner.anchor.setTo(0.5);

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

    this.game.add.existing(this.mushroom);
    this.game.add.existing(this.car);
  }

  update () {
    game.camera.x = this.car.x - game.width/2;
    game.camera.y = this.car.y - game.height/2;
  }

  render () {
    if (__DEV__) {
      this.game.debug.cameraInfo(game.camera, 32, 32);
    }
  }
}
