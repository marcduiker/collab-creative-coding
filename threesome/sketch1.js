/// This interactive sketch publishes mouse coordinates to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 'coordinate' messages
/// and maps that to X & Y coordinates where a circle is be drawn.
///
/// Marc Duiker, @marcduiker, 2022

let x; // This will hold the mouse x position (and min and max values) that we're receiving from sketch 2.
let y; // This will hold the mouse y position (and min and max values) that we're receiving from sketch 2.
let ab; // This will hold the a & b values that we're receiving from sketch 3.
let c;
let light = 240;
let dark = 30;

function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight - 35);
  x = { min: 0, max: windowWidth, pos: windowWidth / 2 };
  y = { min: 0, max: windowHeight, pos: windowHeight / 2 };
  ab = { a: 10, b: 10 };
  c = true;
}

function draw() {
  background(c === true ? light : dark, 50);
  const circleRadius = map(mouseX, 0, windowWidth, 10, 100);
  const brightness = map(mouseY, 0, windowHeight, 0, 255);
  fill(brightness);
  newX = map(x.pos, x.min, x.max, 0, windowWidth) + random(-ab.a, ab.a);
  newY = map(y.pos, y.min, y.max, 0, windowHeight) + random(-ab.b, ab.b);
  circle(newX, newY, circleRadius);
}

function mouseMoved() {
  if (frameCount % 5 === 0 && ably?.connection.state === "connected") {
    channel.publish(coordinatesMessage, {
      x: { min: 0, max: windowWidth, pos: mouseX },
      y: { min: 0, max: windowHeight, pos: mouseY },
    });
  }
}

async function connectClient() {
  await connectAbly("sketch1");
}
