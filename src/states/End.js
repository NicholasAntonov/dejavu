import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        const bannerText = 'Game Over\nPress \'r\' to restart'
        let banner = this.add.text(this.game.width/2, this.game.height/2, bannerText)
        banner.align = 'center'
        banner.font = 'Dejavu Sans'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#FFFFFF'
        banner.smoothed = false
        banner.anchor.setTo(0.5)

    }

    update () {
        if (this.input.keyboard.isDown(Phaser.KeyCode.R)) {
            this.state.start('Game');
        }
    }

    create () {
    }
}
