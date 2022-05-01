class bullet {
    constructor(cx, cy, xSpd, ySpd, charId, _color) {
        this.x = cx;
        this.y = cy;
        this.xSpd = 15 * xSpd;
        this.ySpd = 15 * ySpd;
        this.charId = charId;
        this.color = _color;

        this.fillcolor = color(
            this.color.levels[0], 
            this.color.levels[1], 
            this.color.levels[2], 
            135);
    }

    display() {
        push()
        stroke(this.color);
        fill(this.fillcolor); 
        ellipse(this.x, this.y, 10);
        pop();
    }

    update() {
        this.x += this.xSpd;
        this.y += this.ySpd;
        this.xSpd *= 0.994;
        this.ySpd *= 0.994;
    }

    outOfBounds() {
        return (this.x > CANVAS_WIDTH + 10 || this.x < -10 || this.y > CANVAS_HEIGHT + 10 || this.y < -10);
    }

    hitScan() {
        for (var i = 0; i < characters.length; i++) {
            if (characters[i].getId() !== this.charId) {
                var collideOrNot = collideCircleCircle(this.x, this.y, 10,
                    characters[i].getX(), characters[i].getY(), characters[i].getRadius());
                if (collideOrNot) {
                    characters.splice(i, 1);
                    // score += 1;
                    return true;
                }
            }
        }
        return false;
    }
}