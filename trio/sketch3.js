/// This interactive sketch publishes events with an A and B value between -100 and 100 to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 'coordinate' messages
/// and maps that to a size and brightness of a cross hair that is drawn.
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
  x = { min: 0, max: windowWidth, pos: windowWidth / 2 };
  y = { min: 0, max: windowHeight, pos: windowHeight / 2 };
  c = true;
}

function draw() {
  background(c === true ? light : dark, 50);
  const size = map(x.pos, x.min, x.max, 10, 100);
  const weight = map(x.pos, x.min, x.max, 1, 5);
  const brightness = map(y.pos, y.min, y.max, 0, 255);
  stroke(brightness);
  strokeWeight(weight);
  ab = {
    a: map(mouseX, 0, windowWidth, -100, 100),
    b: map(mouseY, 0, windowHeight, -100, 100),
  };

  const lX = mouseX + random(-ab.a, ab.a);
  const lY = mouseY + random(-ab.b, ab.b);
  line(lX - size, lY, lX + size, lY);
  line(lX, lY - size, lX, lY + size);
}

function mouseMoved() {
  if (frameCount % 5 === 0 && ably?.connection.state === "connected") {
    channel.publish(abValueMessage, {
      ab: ab,
    });
  }
}

function mouseClicked() {
  c = !c;
  if (ably?.connection.state === "connected") {
    channel.publish(clickMessage, { c });
  }
}

async function connectClient() {
  await connectAbly("sketch3");
}
