/// This interactive sketch publishes mouse coordinates to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 
/// radius & brightness values and uses that to draw circles.
///
/// Marc Duiker, @marcduiker, 2022

let ably;
let channel;
const channelName = "collabCreativeCoding";
let circleRadius = 10; // default radius of the circle
let brightness = 50; // default brightness of the circle fill

function setup() {
  frameRate(10);
  createCanvas(windowWidth, windowHeight);
  ably = new Ably.Realtime('API_KEY');
  ably.connection.on('connected', () => {
    console.log('Connected, that was easy');
  });

  channel = ably.channels.get(channelName);
  channel.subscribe((message) => {
    circleRadius = message.data.r ?? circleRadius;
    brightness = message.data.b ?? brightness;
  });
}

function draw() {
  background(240, 50);
  fill(brightness);
  const x = random(0, windowWidth);
  const y = random(0, windowHeight);
  circle(x, y, circleRadius);
  if (frameCount % 10 === 0) {
    channel.publish('coordinates', {x: mouseX, y: mouseY });
  }
}