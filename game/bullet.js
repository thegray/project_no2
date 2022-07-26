class bullet {
    constructor(cx, cy, xSpd, ySpd, charId, _color, rad) {
        this.x = cx;
        this.y = cy;
        this.vx = xSpd //*30;
        this.vy = ySpd //*30;
        this.charId = charId;
        this.color = _color;
        this.size = rad;

        this.fillcolor = color(
            this.color.levels[0], 
            this.color.levels[1], 
            this.color.levels[2], 
            135);
    }

    getCharId() {
        return this.charId;
    }

    display() {
        push()
        stroke(this.color);
        // fill(this.fillcolor);
        fill(255);
        ellipse(this.x, this.y, this.size);
        pop();
    }

    update() {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        // this.vx *= 0.994;
        // this.vy *= 0.994;
    }

    outOfBounds() {
        // return false;
        return (this.x > CANVAS_WIDTH + 10 || this.x < -10 || this.y > CANVAS_HEIGHT + 10 || this.y < -10);
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