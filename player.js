class Player {
    constructor(
        x, y, size, speed, id, color, name
    ) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.id = id;
        this.color = color;
        this.name = name;

        this.ready = true;

        this.angle = 0;
        this.normalizeMouseDirection;
    }

    getMouseVector() {
        return this.normalizeMouseDirection;
    }

    getX() {
        return this.cx;
    }

    getY() {
        return this.cy;
    }

    getRadius() {
        return this.size;
    }

    getId() {
        return this.id;
    }

    getColor() {
        return this.color;
    }

    getIsReady() {
        return this.ready;
    }

    update() {
        if (this.ready === true) {
            this.angle = Math.atan2(mouseY - this.cy, mouseX - this.cx);
            this.normalizeMouseDirection = createVector(mouseX - this.cx, mouseY - this.cy).normalize();
        }
    }

    inputHandler(direction) {
        if (this.ready === true) {
            if (direction === "up") { // w
                if (this.cy > this.size) {
                    this.cy -= this.speed;
                }
            }
            if (direction === "left") { // a
                if (this.cx > this.size) {
                    this.cx -= this.speed;
                }
            }
            if (direction === "down") { // s
                if (this.cy < CANVAS_HEIGHT - this.size) {
                    this.cy += this.speed;
                }
            }
            if (direction === "right") { // d
                if (this.cx < CANVAS_WIDTH - this.size) {
                    this.cx += this.speed;
                }
            }
        }
    }

    // hitScan(){
    // 	for (var i = 0; i < targetBalloons.length; i++){
    // 		var collideOrNot = collideCircleCircle(this.x, this.y, 10, targetBalloons[i].myX(), targetBalloons[i].myY(), targetBalloons[i].myR())
    // 		if (collideOrNot){
    // 			targetBalloons.splice(i,1);
    // 			score += 1;
    // 			return true;
    // 		}
    // 	}
    // 	return false;
    // }
}

module.exports = Player