class inputs {
    constructor() {
        this.deltaTime = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }

    clone() {
        let object = new this.constructor();

		object.deltaTime = this.deltaTime;
		object.moveLeft = this.moveLeft;
		object.moveRight = this.moveRight;
		object.moveUp = this.moveUp;
		object.moveDown = this.moveDown;

		return object;
    }

    testPrint(dt) {
        console.log("delta: ", dt);
    }
}