let MS_SPEED = 2,
    CHAR_RADIUS = 30,
    CANVAS_WIDTH, CANVAS_HEIGHT;

let bulletsFired = [];
let mainChar;
let Characters = [];

function charactersUpdate() {
    mainChar.update();
}

function charactersRender() {
    for (var i = 0; i < Characters.length; i++) {
        Characters[i].display();
    }
}

function bulletsUpdate() {
    for (var i = 0; i < bulletsFired.length; i++) {
        bulletsFired[i].update();
        if (bulletsFired[i].outOfBounds()) {
            bulletsFired.splice(i, 1);
        }
        else if (bulletsFired[i].hitScan()) {
            bulletsFired.splice(i, 1);
        }
    }
}

function bulletsRender() {
    for (var i = 0; i < bulletsFired.length; i++) {
        bulletsFired[i].display();
    }
}

function eventsProcessor(event) {
    // let event = {
    //     type: 'keypress',
    //     value: 'x'
    //   };
    if (event.type === "keypress") {
        mainChar.inputHandler(event.value)
    }
}

function setup() {
    iToTheta = TWO_PI / 3;
    CANVAS_WIDTH = 1024; //windowWidth; 
    CANVAS_HEIGHT = 800; //windowHeight;
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    initObjects();
}

function update() {
    updateController();
    charactersUpdate();
    bulletsUpdate();
}

function render() {
    background(0);
    drawReticle();
    charactersRender();
    bulletsRender();
}

function draw() {
    update();
    render();
}

function initObjects() {
    mainChar = new character();
    // characters.push(mainChar);
    // testChar = new character(200, 200, CHAR_RADIUS, MS_SPEED, 1, color(230, 255, 0));
    // characters.push(testChar);
}

function shoot() {
    let mouseVector = mainChar.getMouseVector();
    oneBullet = new bullet(mainChar.getX(), mainChar.getY(), mouseVector.x, mouseVector.y, mainChar.getId(), mainChar.getColor());
    bulletsFired.push(oneBullet);
}

function updateController() {
    let e = {}
    if (keyIsDown(87)) { // w
        e.type = "keypress";
        e.value = "up";
        eventsProcessor(e);
    }
    if (keyIsDown(65)) { // a
        e.type = "keypress";
        e.value = "left";
        eventsProcessor(e);
    }
    if (keyIsDown(83)) { // s
        e.type = "keypress";
        e.value = "down";
        eventsProcessor(e);
    }
    if (keyIsDown(68)) { // d
        e.type = "keypress";
        e.value = "right";
        eventsProcessor(e);
    }

    if (mouseIsPressed === true) {
        if (mouseButton === LEFT) {
            shoot();
        }
    }
}