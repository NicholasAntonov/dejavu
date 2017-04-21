import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset);
        this.mapnodes = [
            [-1200,-300], [-900,300], [-300,100], [150,300], [800,-100],
            [600,-600], [900,-1000], [700,-1300], [-200,-1000],
            [-300,-300], [-700,-300], [-600,-1000], [-800,-1200],
            [-1100,-1200], [-1200,-700], [-1200,-300]
        ]
        this.outline = [];
        this.curvednodes = [];
        this.visual = null;
    }

    initialize () {
        this.game.physics.p2.enable(this, false);
        this.body.static = true;
        this.anchor.set(0);
        this.body.clearShapes();
        this.generateRoadBoundaries();
        this.body.addPolygon({skipSimpleCheck: true, removeCollinearPoints: 0.1}, this.outline);
        this.body.setCollisionGroup(this.game.game.roadCollisions); // Two games PogChamp (don't know why)
        this.body.collides(this.game.game.roadCollisions);
    }

    getXCoordinates () {
        return this.mapnodes.map( c => c[0] );
    }

    getYCoordinates () {
        return this.mapnodes.map( c => c[1] );
    }

    getPointOnTrack ( percent ) {
        var pointsx = this.getXCoordinates();
        var pointsy = this.getYCoordinates();

        var xpos = this.game.math.catmullRomInterpolation(pointsx, percent);
        var ypos = this.game.math.catmullRomInterpolation(pointsy, percent);

        var dx = this.game.math.catmullRomInterpolation(pointsx, percent+0.001) - xpos;
        var dy = this.game.math.catmullRomInterpolation(pointsy, percent+0.001) - ypos;
        var angle = Math.atan(dy/dx) + Math.PI/2;

        xpos += this.x;
        ypos += this.y;

        return {x: xpos, y: ypos, a: angle};
    }

    generateRoadBoundaries () {
        // At certain (uniform) points along the Catmull Rom curve of these points,
        //   - Find the current slope of curve
        //   - Generate collision points perpendicular to this slope 

        // In order to get a decent distribution of sample points, we need
        //   to find the distance of the track
        var distance = 0;
        for ( var i = 0; i < this.mapnodes.length - 1; i++ ) {
            var x = this.mapnodes[i][0];
            var y = this.mapnodes[i][1];
            var nx = this.mapnodes[i+1][0];
            var ny = this.mapnodes[i+1][1];
            distance += this.game.math.distance(x, y, nx, ny);
        }

        const DISTANCE_BETWEEN_SAMPLES = 70; // Measured in pixels
        const ROAD_WIDTH_FROM_CENTER = 100;   // Measured in pixels

        const STEP = 1/(distance/DISTANCE_BETWEEN_SAMPLES);
        const DELTA = STEP/10;

        var pointsx = this.getXCoordinates();
        var pointsy = this.getYCoordinates();
        for ( var j = 0; j < 1; j += STEP ) {
            var leftx = 0;
            var lefty = 0;
            var rightx = 0;
            var righty = 0;

            var plusx  = this.game.math.catmullRomInterpolation(pointsx, j+DELTA);
            var x      = this.game.math.catmullRomInterpolation(pointsx, j);
            var minusx = this.game.math.catmullRomInterpolation(pointsx, j-DELTA);
            var dx = plusx - minusx;

            var plusy  = this.game.math.catmullRomInterpolation(pointsy, j+DELTA);
            var y      = this.game.math.catmullRomInterpolation(pointsy, j);
            var minusy = this.game.math.catmullRomInterpolation(pointsy, j-DELTA);
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
            this.outline.splice(this.outline.length/2, 0, leftx, lefty, rightx, righty);

            // Add the current positional nodes to the curved map array
            this.curvednodes.push(new Phaser.Point(x+this.x, y+this.y));
        }

        // Add on the initial coordinates to create a closed loop
        var leftx = this.outline[0];
        var lefty = this.outline[1];
        var rightx = this.outline[this.outline.length - 2];
        var righty = this.outline[this.outline.length - 1];

        this.outline.splice(this.outline.length/2, 0, leftx, lefty, rightx, righty);

        var first = this.curvednodes[0];
        this.curvednodes.push(new Phaser.Point(first.x, first.y));
    }

    update () {

    }
}
