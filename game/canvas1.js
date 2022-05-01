let X = 0.0,
  Y = 0.0,
  PX = 500,
  PY = 500,
  MS_SPEED = 2,
  CHAR_RADIUS = 30,
  CURSOR_LENGTH = 45.0,
  ARRHEAD_LENGTH = 20.0,
  CANVAS_WIDTH, CANVAS_HEIGHT;

const BULLET_LENGTH = 15;

// let iToTheta;

let ANGLE_DEBUG = 0;
// let x1_DEBUG = 0;
// let y1_DEBUG = 0;
let CHARX, CHARY = 0;
let CHAR_ANGLE = 0;

bulletPool = {
  ready: [],
  onCanvas: [],
  speed: 0,
  cooldown: 0,
  cooldownTime: 0
}

bulletObj = {
  ix: 0,
  iy: 0,
  px: 0,
  py: 0,
  range: 0,
  speed: 0,
  isOn: false
}

populateBulletPool = (count=20, cooldownTime=2, speed=3) => {
  bulletPool.cooldownTime = cooldownTime;
  bulletPool.speed = speed;
  for (let i = 0; i < count; i++) {
    let missile = {}
    missilePool.ready.push(missile);
  }
}
  

function setup() {
  iToTheta = TWO_PI / 3;
  CANVAS_WIDTH = 1024; //windowWidth; 
  CANVAS_HEIGHT = 800; //windowHeight;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // strokeWeight(CHAR_RADIUS);
  // stroke(255, 100);
}

function draw() {
  background(0);

  targetAngle = atan2(mouseY - PY, mouseX - PX);

  drawChar(PX, PY, targetAngle)

  CHARX = PX;
  CHARY = PY;
  CHAR_ANGLE = targetAngle;

  drawChar(600, 400, ANGLE_DEBUG);

  drawBullet();

  updateBullet();
  updateController();
}

function drawChar(_px, _py, _angle) {
  drawWeapon(_px, _py, _angle);

  strokeWeight(3);
  stroke(color(255, 0, 0)); 
  ellipse(_px, _py, CHAR_RADIUS, CHAR_RADIUS);
}

function drawWeapon(sx, sy, angle) {
  strokeWeight(3);
	stroke(color(255, 0, 0)); 
  //direction facing the mouse
	line(sx, sy, sx + cos(angle) * CURSOR_LENGTH, sy + sin(angle) * CURSOR_LENGTH);
}

function updateBullet() {
  if (bulletObj.isOn == true) {
    bulletObj.range += bulletObj.speed
    bulletObj.px += bulletObj.speed;
    bulletObj.py += bulletObj.speed;
  }
  if (bulletObj.px < CHAR_RADIUS || bulletObj.px > CANVAS_WIDTH-CHAR_RADIUS ||
    bulletObj.py < CHAR_RADIUS || bulletObj.py > CANVAS_HEIGHT-CHAR_RADIUS) 
  {
    bulletObj.isOn = false;
  }
}

function drawBullet() {
  if (bulletObj.isOn == false) {
    return
  }
  strokeWeight(3);
	stroke(color(255, 0, 0)); 
  //direction facing the mouse
  let sb = bulletObj.range+BULLET_LENGTH
  let sx = bulletObj.ix;
  let sy = bulletObj.iy;
  let angle = bulletObj.angle;
	line(sx + cos(angle) * BULLET_LENGTH, sy + sin(angle) * BULLET_LENGTH, 
    sx + cos(angle) * sb, sy + sin(angle) * sb);
}

function shoot() {
  if (bulletObj.isOn == true) {
    return
  }
  bulletObj.ix = bulletObj.px = CHARX;
  bulletObj.iy = bulletObj.py = CHARY;
  bulletObj.range = ARRHEAD_LENGTH;
  bulletObj.speed = 1;
  bulletObj.isOn = true;

  // drawBullet(CHARX, CHARY, CHAR_ANGLE, ARRHEAD_LENGTH);
}

// function drawTri1(tx, ty, angle) {
//   noStroke();
// 	beginShape();
// 	for (let i = 0; i < 3; ++i) {
// 		const theta = angle + i * iToTheta;
//     let x1 = tx + cos(theta) * ARRHEAD_LENGTH;
//     let y1 = ty + sin(theta) * ARRHEAD_LENGTH;
// 		vertex(x1, y1);
// 	}
// 	endShape(CLOSE);
// }

function updateController() {
  if (keyIsDown(87)) { // w
    if (PY > CHAR_RADIUS) {
      PY -= MS_SPEED;
      // debug
      ANGLE_DEBUG += 30;
      ANGLE_DEBUG %= 360;
    }
  }
  if (keyIsDown(65)) { // a
    if (PX > CHAR_RADIUS) {
      PX -= MS_SPEED;
    }
  }
  if (keyIsDown(83)) { // s
    if (PY < CANVAS_HEIGHT-CHAR_RADIUS) {
      PY += MS_SPEED;
    }
  }
  if (keyIsDown(68)) { // d
    if (PX < CANVAS_WIDTH-CHAR_RADIUS) {
      PX += MS_SPEED;
    }
  }
  if (mouseIsPressed === true) {
    if (mouseButton === LEFT) {
      console.log("left click");
      shoot();
    }
  }
  // if (keyIsDown(32)) { // d
  //   let tx = 600;
  //   let ty = 400;
  //   console.log(`angle: ${ANGLE_DEBUG}`)
  //   let theta = ANGLE_DEBUG + 0 * iToTheta;
  //   x1_DEBUG = tx + cos(theta) * ARRHEAD_LENGTH;
  //   y1_DEBUG = ty + sin(theta) * ARRHEAD_LENGTH;
	// 	console.log(`theta: ${theta}, x: ${x1_DEBUG}, y: ${y1_DEBUG}`);

  //   theta = ANGLE_DEBUG + 1 * iToTheta;
  //   x1_DEBUG = tx + cos(theta) * ARRHEAD_LENGTH;
  //   y1_DEBUG = ty + sin(theta) * ARRHEAD_LENGTH;
	// 	console.log(`theta: ${theta}, x: ${x1_DEBUG}, y: ${y1_DEBUG}`);

  //   theta = ANGLE_DEBUG + 2 * iToTheta;
  //   x1_DEBUG = tx + cos(theta) * ARRHEAD_LENGTH;
  //   y1_DEBUG = ty + sin(theta) * ARRHEAD_LENGTH;
	// 	console.log(`theta: ${theta}, x: ${x1_DEBUG}, y: ${y1_DEBUG}`);
  //   console.log("===============");
  // }
}