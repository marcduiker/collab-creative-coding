/// This interactive sketch publishes mouse coordinates to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 'coordinate' messages
/// and maps that to X & Y coordinates where a circle is be drawn.
///
/// Marc Duiker, @marcduiker, 2022

let x; // This will hold the mouse x position (and min and max values) that we're receiving from sketch 2.
let y; // This will hold the mouse y position (and min and max values) that we're receiving from sketch 2.

function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight);
  x = { min: 0, max: windowWidth, pos: windowWidth / 2 };
  y = { min: 0, max: windowHeight, pos: windowHeight / 2 };
}

function draw() {
  background(240, 50);
  const circleRadius = map(mouseX, 0, windowWidth, 10, 100);
  const brightness = map(mouseY, 0, windowHeight, 0, 255);
  fill(brightness);
  newX = map(x.pos, x.min, x.max, 0, windowWidth) + random(-10, 10);
  newY = map(y.pos, y.min, y.max, 0, windowHeight) + random(-10, 10);
  circle(newX, newY, circleRadius);
}

function mouseMoved() {
  if (frameCount % 5 === 0 && ably?.connection.state === "connected") {
    channel.publish("coordinates", {
      x: { min: 0, max: windowWidth, pos: mouseX },
      y: { min: 0, max: windowHeight, pos: mouseY },
    });
  }
}
