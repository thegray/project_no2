var CFG = require('./config.js')

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

        this.alive = false; ////
        this.lastShoot = 0;
        this.shootCooldown = CFG.GC.BLT_COOLDOWN;

        this.angle = 0;
    }

    getMouseVector() {
        return this.normalizeMouseDirection;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
    }

    getRadius() {
        return this.size;
    }

    setRadius(r) {
        this.size = r;
    }

    getId() {
        return this.id;
    }

    getColor() {
        return this.color;
    }

    getIsAlive() {
        return this.alive;
    }

    setAlive(alive) {
        this.alive = alive;
    }

    getAngle() {
        return this.angle;
    }

    setSpeed(s) {
        this.speed = s;
    }

    // getCurrentTargetVector(targetx, targety) {
    //     return createVector(targetx - this.x, targety - this.y).normalize();
    // }

    // update() {
    //     if (this.ready === true) {
    //         this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    //         this.normalizeMouseDirection = createVector(mouseX - this.x, mouseY - this.y).normalize();
    //     }
    // }

    setAngle(angle) {
        this.angle = angle;
    }

    canShoot() {
        let delta = (Date.now() - this.lastShoot) / 1000;
        return delta > this.shootCooldown;
    }

    shoot() {
        this.lastShoot = Date.now();
    }

    inputHandler(direction) {
        if (this.alive === true) {
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
                if (this.y < CFG.GC.CANVAS_HEIGHT - this.size) {
                    this.y += this.speed;
                }
            }
            if (direction === "right") { // d
                if (this.x < CFG.GC.CANVAS_WIDTH - this.size) {
                    this.x += this.speed;
                }
            }
            return true;
        }
        else 
            return false;
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