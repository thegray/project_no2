let X = 0.0,
  Y = 0.0,
  PX = 500,
  PY = 500,
  MS_SPEED = 2,
  CHAR_RADIUS = 20,
  CURSOR_LENGTH = 25.0,
  CANVAS_WIDTH, CANVAS_HEIGHT;
  

function setup() {
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

  updateController();
}

function drawChar(_px, _py, _angle) {
  drawLine(_px, _py, _angle);
  ellipse(_px, _py, CHAR_RADIUS, CHAR_RADIUS);
}

function drawLine(sx, sy, angle) {
  strokeWeight(3);
	stroke(color(255, 0, 0)); 
  //direction facing the mouse
	line(sx, sy, sx + cos(angle) * CURSOR_LENGTH, 
    sy + sin(angle) * CURSOR_LENGTH);
}

function updateController() {
  if (keyIsDown(87)) { // w
    if (PY > CHAR_RADIUS) {
      PY -= MS_SPEED;
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
}