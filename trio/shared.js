const light = 240;
const dark = 30;

let coordinate1; // This will hold the mouse x & y position (and min and max values) for sketch 1.
let coordinate2; // This will hold the mouse x & y position (and min and max values) for sketch 2.
let coordinate3; // This will hold the mouse x & y position (and min and max values) for sketch 3.

let c;

let x1;
let y1;
let x2;
let y2;
let x3;
let y3;

let dist12;
let dist13;
let dist23;

const dist12Name = 'dist12';
const dist13Name = 'dist13';
const dist23Name = 'dist23';

let isSimulation = true;
let noiseVal = 0.1;
const noiseIncrement = 0.007;

function setTextSettings() {
	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(16);
}

function setDefaultCoordinates() {
	coordinate1 = {
		x: { min: 0, max: windowWidth, pos: windowWidth / 3 },
		y: { min: 0, max: windowHeight, pos: windowHeight / 2 },
	};
	coordinate2 = {
		x: { min: 0, max: windowWidth, pos: windowWidth / 2 },
		y: { min: 0, max: windowHeight, pos: windowHeight / 2 },
	};
	coordinate3 = {
		x: { min: 0, max: windowWidth, pos: (windowWidth / 3) * 2 },
		y: { min: 0, max: windowHeight, pos: windowHeight / 2 },
	};
}

function setXYValues() {
	x1 = map(
		coordinate1.x.pos,
		coordinate1.x.min,
		coordinate1.x.max,
		0,
		windowWidth
	);
	y1 = map(
		coordinate1.y.pos,
		coordinate1.y.min,
		coordinate1.y.max,
		0,
		windowHeight
	);
	x2 = map(
		coordinate2.x.pos,
		coordinate2.x.min,
		coordinate2.x.max,
		0,
		windowWidth
	);
	y2 = map(
		coordinate2.y.pos,
		coordinate2.y.min,
		coordinate2.y.max,
		0,
		windowHeight
	);
	x3 = map(
		coordinate3.x.pos,
		coordinate3.x.min,
		coordinate3.x.max,
		0,
		windowWidth
	);
	y3 = map(
		coordinate3.y.pos,
		coordinate3.y.min,
		coordinate3.y.max,
		0,
		windowHeight
	);
}

function calcDistances() {
	dist12 = dist(x1, y1, x2, y2);
	dist13 = dist(x1, y1, x3, y3);
	dist23 = dist(x2, y2, x3, y3);
}

function drawNumbers() {
	noStroke();
	fill(20);
	circle(x1, y1, 20);
	circle(x2, y2, 20);
	circle(x3, y3, 20);
	fill(255);
	text('1', x1, y1);
	text('2', x2, y2);
	text('3', x3, y3);
}

function drawBackground(distance, color1, color2) {
	const gap = map(distance, 0, windowWidth / 2, 1, 50);
	for (let x = 0; x < windowWidth; x += gap) {
		strokeWeight(1);
		stroke(lerpColor(color1, color2, x / windowWidth));
		line(x, 0, x, windowHeight);
	}
}

function drawCircleShape() {
	const radius = map(x1, 0, windowWidth, 10, 100);
	const verticeLength = map(y1, 0, windowHeight, 0.1, 1.1);
	const maxNoiseX = map(abs(x3 - windowWidth / 2), 0, windowWidth / 2, 0, 30);
	const maxNoiseY = map(
		abs(y3 - windowHeight / 2),
		0,
		windowHeight / 2,
		0,
		30
	);
	push();
	translate(x2, y2);
	beginShape();
	for (let a = TWO_PI; a > -TWO_PI; a -= verticeLength) {
		let r1 = radius;
		let rx1 = r1 * cos(a) + random(-maxNoiseX, maxNoiseX);
		let ry1 = r1 * sin(a) + random(-maxNoiseY, maxNoiseY);
		vertex(rx1, ry1);
	}
	endShape(CLOSE);
	pop();
}

function toggleSimulation() {
	isSimulation = !isSimulation;
}

function drawSimulatedCoordinate1(noiseOffset) {
	coordinate1 = drawSimulatedCoordinate(coordinate1, noiseOffset);
}

function drawSimulatedCoordinate2(noiseOffset) {
	coordinate2 = drawSimulatedCoordinate(coordinate2, noiseOffset);
}

function drawSimulatedCoordinate3(noiseOffset) {
	coordinate3 = drawSimulatedCoordinate(coordinate3, noiseOffset);
}

function drawSimulatedCoordinate(coordinate, noiseOffset) {
	coordinate.x.pos = constrain(
		noise(noiseVal + noiseOffset) * windowWidth,
		0,
		windowWidth
	);
	coordinate.y.pos = constrain(
		noise(noiseVal + noiseOffset * 1.5) * windowHeight,
		0,
		windowHeight
	);
	noiseVal += noiseIncrement;
	return coordinate;
}

function swapColors() {
	const temp = color1;
	color1 = color2;
	color2 = temp;
}
