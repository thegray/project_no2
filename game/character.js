class character {
    constructor() {
        this.alive = false;
    }

    CharacterInit(x, y, size, speed, id, color
        , cd, name
    ) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.id = id;
        this.color = color;
        this.name = name;

        // this.alive = true;
        this.lastShoot = 0;
        this.shootCooldown = cd;
        this.angle = 0;
        this.normalizeMouseDirection;
    }

    setAlive(alive) {
        this.alive = alive;
    }

    getIsAlive() {
        return this.alive;
    }

    getMouseVector() {
        this.normalizeMouseDirection = createVector(mouseX - this.x, mouseY - this.y).normalize();
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

    getLastShoot() {
        return this.lastShoot;
    }

    update() {
        if (this.alive === true) {
            this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
            PlayerAngleEvent(this.angle);
            //
            // this.normalizeMouseDirection = createVector(mouseX - this.x, mouseY - this.y).normalize();
        }
    }

    display() {
        if (this.alive === true) {
            push()
            translate(this.x, this.y);
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
            // line(this.x, this.y,
            //     this.x + cos(this.angle) * 40, this.y + sin(this.angle) * 40);
            ellipse(this.x, this.y, this.size, this.size);
            // pop();
        }
    }

    inputHandler(event) {
        if (this.alive === true) {
            if (event.type === "keypress") {
                let direction = event.value;
                if (direction === "up") { // w
                    if (this.y > this.size) {
                        // this.y -= this.speed;
                        PlayerMoveEvent("up");
                    }
                }
                if (direction === "left") { // a
                    if (this.x > this.size) {
                        // this.x -= this.speed;
                        PlayerMoveEvent("left");
                    }
                }
                if (direction === "down") { // s
                    if (this.y < CANVAS_HEIGHT - this.size) {
                        // this.y += this.speed;
                        PlayerMoveEvent("down");
                    }
                }
                if (direction === "right") { // d
                    if (this.x < CANVAS_WIDTH - this.size) {
                        // this.x += this.speed;
                        PlayerMoveEvent("right");
                    }
                }
            } else if (event.type === "mouseclick") {
                if (event.value === "left") {
                    let delta = (Date.now() - this.lastShoot) / 1000;
                    if (delta > this.shootCooldown) {
                        let mouseVector = this.getMouseVector();
                        let vector = {
                            x: mouseVector.x,
                            y: mouseVector.y
                        }
                        PlayerShootEvent(vector);
                        this.lastShoot = Date.now();
                    }
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