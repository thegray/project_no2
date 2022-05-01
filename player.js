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
        return this.x;
    }

    getY() {
        return this.y;
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

    // update() {
    //     if (this.ready === true) {
    //         this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    //         this.normalizeMouseDirection = createVector(mouseX - this.x, mouseY - this.y).normalize();
    //     }
    // }

    inputHandler(direction) {
        if (this.ready === true) {
            if (direction === "up") { // w
                if (this.y > this.size) {
                    this.y -= this.speed;
                }
            }
            if (direction === "left") { // a
                if (this.x > this.size) {
                    this.x -= this.speed;
                }
            }
            if (direction === "down") { // s
                if (this.y < 800 - this.size) {
                    this.y += this.speed;
                }
            }
            if (direction === "right") { // d
                if (this.x < 1024 - this.size) {
                    this.x += this.speed;
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