function UI_DrawReticle() {
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
	text("w a s d key to move", 35, 35);
	text("move mouse aim", 35, 50);
	text("left click to shoot", 35, 65);
}

function UI_GameReady() {
	push()

	noStroke();
	fill(0, 0, 0, 95)
	rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

	drawTutorial();

	textFont('Helvetica');
	textAlign(CENTER);
	textSize(18);
	fill(235);
	let readyText = "press 'space' to play";
	text(readyText, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	pop();
}

function UI_GameOver() {
	push()

	noStroke();
	fill(0, 0, 0, 95)
	rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

	textFont('Georgia');
	textAlign(CENTER);
	textSize(50);
	fill(170, 20, 20);
	text("YOU DIED", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

	textFont('Helvetica');
	textAlign(CENTER);
	textSize(18);
	fill(235);
	let readyText = "press 'space' to try again";
	text(readyText, CANVAS_WIDTH/2, CANVAS_HEIGHT/2+40);
	pop();
}