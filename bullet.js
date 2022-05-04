var CFG = require('./config.js')

class Bullet {
    // constructor(cx, cy, xSpd, ySpd, pId, _color) {
    //     this.x = cx;
    //     this.y = cy;
    //     this.xSpd = CFG.GC.BLT_SPEED * xSpd;
    //     this.ySpd = CFG.GC.BLT_SPEED * ySpd;
    //     this.playerId = pId;
    //     this.color = _color;
    // }
    constructor() {
        this.reset();
    }

    isOnFlight() {
        return this.onFlight;
    }

    setPlayerId(pId) {
        this.playerId = pId;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setVectorX(valx) {
        this.vx = CFG.GC.BLT_SPEED * valx;
    }

    setVectorY(valy) {
        this.vy = CFG.GC.BLT_SPEED * valy;
    }

    setColor(col) {
        this.color = col;
    }

    setOnFlight(onFlight) {
        this.onFlight = onFlight;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.994;
        this.vy *= 0.994;
    }

    isOutOfBounds() {
        return (this.x > CFG.GC.CANVAS_WIDTH + 10 || this.x < -10 || 
            this.y > CFG.GC.CANVAS_HEIGHT + 10 || this.y < -10);
    }

    reset() {
        this.x = -100;
        this.y = -100;
        this.playerId = "";
        this.vx = 0;
        this.vy = 0;
        this.onFlight = false;
    }

    // hitScan() {
    //     for (var i = 0; i < Characters.length; i++) {
    //         if (Characters[i].getId() !== this.charId) {
    //             var collideOrNot = collideCircleCircle(this.x, this.y, 10,
    //                 Characters[i].getX(), Characters[i].getY(), Characters[i].getRadius());
    //             if (collideOrNot) {
    //                 Characters.splice(i, 1);
    //                 // score += 1;
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }
}

module.exports = Bullet