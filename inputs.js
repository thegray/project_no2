class inputs {
    constructor() {
        this.deltaTime = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.angle = 0;
    }

    clone() {
        let object = new this.constructor();

		object.deltaTime = this.deltaTime;
		object.moveLeft = this.moveLeft;
		object.moveRight = this.moveRight;
		object.moveUp = this.moveUp;
		object.moveDown = this.moveDown;
        object.angle = this.angle;

		return object;
    }

    testPrint(dt) {
        console.log("delta: ", dt);
    }
}