import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset);
        this.pointsx = [0, 100, 0, -100, 0];
        this.pointsy = [0, 300, 0, -200, -100];
        this.outline = [];
    }

    initialize () {
        this.game.physics.p2.enableBody(this, true);
        this.body.mass = 0;
        this.body.static = true;
        this.body.clearShapes();
        this.outline = this.generateRoadBoundaries();
        this.body.addPolygon({removeCollinearPoints: 10}, this.outline);
    }

    generateRoadBoundaries () {
        // Read X and Y coordinates of the corners
        // At certain (uniform) points along the Catmull Rom curve of these points,
        //   - Find the current slope of curve
        //   - Generate collision points perpendicular to this slope 

        /// this.points = readMapData("filename");
        /// this.pointsx = this.points x values;
        /// this.pointsy = this.points y values;
        
        // In order to get a decent distribution of sample points, we need
        //   to find the distance of the track
        var distance = 0;
        for ( var i = 0; i < this.pointsx.length - 1; i++ ) {
            var x = this.pointsx[i];
            var y = this.pointsy[i];
            var nx = this.pointsx[i+1];
            var ny = this.pointsy[i+1];
            distance += this.game.math.distance(x, y, nx, ny);
        }

        const DISTANCE_BETWEEN_SAMPLES = 10; // Measured in pixels
        const ROAD_WIDTH_FROM_CENTER = 75;   // Measured in pixels

        const STEP = 1/(distance/DISTANCE_BETWEEN_SAMPLES);
        const DELTA = STEP/10;

        var polygon = [];
        for ( var j = 0; j < 1; j += STEP ) {
            var leftx = 0;
            var lefty = 0;
            var rightx = 0;
            var righty = 0;

            var plusx  = this.game.math.catmullRomInterpolation(this.pointsx, j+DELTA);
            var x      = this.game.math.catmullRomInterpolation(this.pointsx, j);
            var minusx = this.game.math.catmullRomInterpolation(this.pointsx, j-DELTA);
            var dx = plusx - minusx;

            var plusy  = this.game.math.catmullRomInterpolation(this.pointsy, j+DELTA);
            var y      = this.game.math.catmullRomInterpolation(this.pointsy, j);
            var minusy = this.game.math.catmullRomInterpolation(this.pointsy, j-DELTA);
            var dy = plusy - minusy;

            var inv_vec = new Phaser.Point(-dy, dx);
            inv_vec.normalize()
                   .multiply(ROAD_WIDTH_FROM_CENTER, ROAD_WIDTH_FROM_CENTER);
            leftx = x + inv_vec.x;
            lefty = y + inv_vec.y;
            
            inv_vec.multiply(-1,-1);
            rightx = x + inv_vec.x;
            righty = y + inv_vec.y;

            // Splice the points into the middle of the array
            polygon.splice(polygon.length/2, 0, leftx, lefty, rightx, righty);
        }
        return polygon;
    }

    update () {

    }
}
