function drawReticle() {
	push();
	noFill();
	strokeWeight(1.5);
	stroke(0, 100, 125, 125);
	ellipse(mouseX, mouseY, 20);
	stroke(80, 160, 200, 125);
	line(mouseX - 14, mouseY - 14, mouseX + 14, mouseY + 14);
	line(mouseX + 14, mouseY - 14, mouseX - 14, mouseY + 14);
	stroke(80, 160, 200, 125);
	// line(mainChar.getX(), mainChar.getY(), mouseX, mouseY);
	pop();
}

function drawTutorial() {
	textAlign(LEFT);
	textFont('Helvetica');
	textSize(14);
	fill(235);
	text("arrow keys or wasd: move", 35, 35);
	text("mouse: aim", 35, 50);
	text("left click: fire", 35, 65);
}