let x = 100,
  y = 100,
  angle1 = 0.0,
  segLength = 50,
  playerX = 200,
  playerY = 200,
  msSpeed = 2,
  radius = 20,
  canvasWidth, 
  canvasHeight;
  

function setup() {
  canvasWidth = 1024; //windowWidth; 
  canvasHeight = 800; //windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  strokeWeight(radius);
  stroke(255, 100);
}

function draw() {
  background(0);

  dx = mouseX - x;
  dy = mouseY - y;
  angle1 = atan2(dy, dx);
  x = mouseX - cos(angle1) * segLength;
  y = mouseY - sin(angle1) * segLength;

  // _segment(x, y, angle1);
  // _segment2(playerX, playerY, angle1);
  ellipse(playerX, playerY, radius, radius);

  updateController();
}

// function _segment(x, y, a) {
//   push();
//   translate(x, y);
//   rotate(a);
//   line(x, y, segLength, 0);
//   pop();
// }

function _segment2(px, py, a) {
  push();
  translate(px, py);
  rotate(a);
  line(10, 10, 30, 30);
  pop();
}

function updateController() {
  if (keyIsDown(87)) { // w
    if (playerY > radius) {
      playerY -= msSpeed;
    }
  }
  if (keyIsDown(65)) { // a
    if (playerX > radius) {
      playerX -= msSpeed;
    }
  }
  if (keyIsDown(83)) { // s
    if (playerY < canvasHeight-radius) {
      playerY += msSpeed;
    }
  }
  if (keyIsDown(68)) { // d
    if (playerX < canvasWidth-radius) {
      playerX += msSpeed;
    }
  }
}