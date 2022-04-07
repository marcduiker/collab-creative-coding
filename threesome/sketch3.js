/// This interactive sketch publishes mouse click events with an X and Y value between -100 and 100 to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 'coordinate' messages
/// and maps that to a size and brightness of a cross hair that is drawn.
///
/// Marc Duiker, @marcduiker, 2022

let x; // This will hold the mouse x position (and min and max values) that we're receiving from sketch 1.
let y; // This will hold the mouse y position (and min and max values) that we're receiving from sketch 1.
let light = 240;
let dark = 20;
let bgBrightness;

function setup() {
  frameRate(15);
  bgBrightness = light;
  createCanvas(windowWidth, windowHeight-35);
  x = { min: 0, max: windowWidth, pos: windowWidth / 2 };
  y = { min: 0, max: windowHeight, pos: windowHeight / 2 };
}

function draw() {
  background(bgBrightness, 50);
  rectMode(CENTER);
  const size = map(x.pos, x.min, x.max, 10, 100);
  const weight = map(x.pos, x.min, x.max, 1, 5);
  const brightness = map(y.pos, y.min, y.max, 0, 255);
  stroke(brightness);
  strokeWeight(weight);
  c = {
    x: map(mouseX, 0, windowWidth, -100, 100),
    y: map(mouseY, 0, windowHeight, -100, 100),
  };

  const lX = mouseX + random(-c.x, c.x);
  const lY = mouseY + random(-c.y, c.y);
  line(lX-size, lY, lX+size, lY);
  line(lX, lY-size, lX, lY+size);
}

function mouseClicked() {
  bgBrightness = bgBrightness === light ? dark : light;
  channel.publish(clickMessage, {
    c : c
  });
}
