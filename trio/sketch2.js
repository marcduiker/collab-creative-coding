/// This interactive sketch publishes mouse coordinates to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 'coordinate' messages
/// and maps that to a size and brightness of a square that is drawn.
///
/// Marc Duiker, @marcduiker, 2022

let x; // This will hold the mouse x position (and min and max values) that we're receiving from sketch 1.
let y; // This will hold the mouse y position (and min and max values) that we're receiving from sketch 1.
let c;
let light = 240;
let dark = 30;

function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight - 35);
  c = true;
  x = { min: 0, max: windowWidth, pos: windowWidth / 2 };
  y = { min: 0, max: windowHeight, pos: windowHeight / 2 };
}

function draw() {
  background(c === true ? light : dark, 50);
  rectMode(CENTER);
  const size = map(x.pos, x.min, x.max, 10, 100);
  const brightness = map(y.pos, y.min, y.max, 0, 255);
  fill(brightness);
  square(mouseX, mouseY, size);
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
  await connectAbly("sketch2");
}
