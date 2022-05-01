class character {
    constructor() {
        this.ready = false;
    }

    CharacterInit(x, y, size, speed, id, color
        , name
    ) {
        this.cx = x;
        this.cy = y;
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

    display() {
        if (this.ready === true) {
            push()
            translate(this.cx, this.cy);
            rotate(this.angle);
            translate(20, -10);
            // noFill();
            stroke(this.color)
            triangle(
                0, 0,
                0, 20,
                10, 10
            );
            pop();

            // push();
            strokeWeight(3);
            stroke(this.color);
            // noFill();
            // line(this.cx, this.cy,
            //     this.cx + cos(this.angle) * 40, this.cy + sin(this.angle) * 40);
            ellipse(this.cx, this.cy, this.size, this.size);
            // pop();
        }
    }

    inputHandler(direction) {
        if (this.ready === true) {
            if (direction === "up") { // w
                if (this.cy > this.size) {
                    // this.cy -= this.speed;
                    PlayerMoveEvent("up");
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