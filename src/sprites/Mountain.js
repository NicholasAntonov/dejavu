import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset, points }) {
        super(game, x, y, asset);
        this.outline = points;
        this.game.physics.p2.enable(this, false);
        this.body.static = true;
        this.body.clearShapes();
        this.body.addPolygon({skipSimpleCheck: true}, this.outline);

        this.graphic = this.game.add.graphics(x,y);
    }

    update () {
        this.graphic.clear();
        this.graphic.beginFill(0x4B2513);
        this.graphic.drawPolygon(this.outline);
        this.graphic.endFill();

    }
}
