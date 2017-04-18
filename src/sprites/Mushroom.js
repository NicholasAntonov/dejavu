import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this
    this.pointsx = [1400, 1500, 1600, 1500, 1400]
    this.pointsy = [560, 660, 560, 460, 560]
  }

  update () {
    this.angle += 1

    var x = this.game.time.now/3000 % 1
    var y = this.game.time.now/3000 % 1

    this.x = this.game.math.catmullRomInterpolation(this.pointsx, x)
    this.y = this.game.math.catmullRomInterpolation(this.pointsy, y)
  }
}
