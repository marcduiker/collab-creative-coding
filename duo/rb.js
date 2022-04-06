/// This interactive sketch maps mouse coordinates to radius and 
/// brightness values and publishes those to an Ably channel.
/// The sketch is subscribed to the same channel to listen to 
/// X & Y coordinates and uses that to draw squares.
///
/// Marc Duiker, @marcduiker, 2022

let ably;
let channel;
const channelName = "collabCreativeCoding";
let x;
let y;

function setup() {
  frameRate(10);
  createCanvas(windowWidth, windowHeight);
  ably = new Ably.Realtime('API_KEY');
  ably.connection.on('connected', () => {
    console.log('Connected, that was easy');
  });
  x = windowWidth/2;
  y = windowHeight/2;
  channel = ably.channels.get(channelName);
  channel.subscribe((message) => {
    x = message.data.x ?? x;
    y = message.data.y ?? y;
  });
}

function draw() {
  background(240, 50);
  square(x, y, 100);
  let circleRadius = map(mouseX, 0, windowWidth, 10, 100);
  let brightness = map(mouseY, 0, windowHeight, 0, 255);
  if (frameCount % 10 === 0) {
    channel.publish('rendering', {r: circleRadius, b: brightness });
  }
}