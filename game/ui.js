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
	text("arrow keys or wasd: move", 35, 35);
	text("mouse: aim", 35, 50);
	text("left click: fire", 35, 65);
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
	textSize(18);
	fill(235);

	// let scoreString = "score: " + score;
	// text(scoreString, 300, 340);
	// if (score > highScore) {
	// 	highScore = score;
	// 	Cookies.remove('highscore');
	// 	Cookies.set('highscore', highScore);
	// }
	// let highScoreString = "highscore: " + highScore;
	// text(highScoreString, 300, 360);

	// Retry.show();
	// Retry.position(250, 380);
	// Retry.size(100,30);
	// Retry.style('background-color', '#202020');
	// Retry.style('color', '#FFFFFF');
	// Retry.mousePressed(reset);

	pop();

	// noLoop();
}