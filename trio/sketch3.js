/// Each of the three interactive sketches publishes mouse coordinates 
/// and click events to an Ably channel. The sketch is subscribed to 
/// 'coordinate' and 'click' messages and uses this data to control 
/// different things on the shape that is drawn.
///
/// Marc Duiker, @marcduiker, 2022

let color1;
let color2;
let minDistance;
let closestNeighbour;

function setup() {
    frameRate(15);
    createCanvas(windowWidth, windowHeight - 35);
    setTextSettings();
    color1 = color('#80FF00');
    color2 = color('#FF0080');
    minDistance = dist23;
    closestNeighbour = dist23Name;
    setDefaultCoordinates();
    c = true;
}

function draw() {
    const fillColor = c === true ? light : dark;
    const strokeColor = c === true ? color2 : color1;

    background(fillColor, 50);
    coordinate3.x.pos = mouseX;
    coordinate3.y.pos = mouseY;
    setXYValues();
    calcDistances();

    drawBackground(minDistance, color1, color2);

    stroke(strokeColor);
    fill(fillColor);
    drawLines();
    drawCircleShape();
    drawNumbers();
}

function drawLines() {
  const maxDistance = windowWidth / 3;
  if (dist13 < maxDistance || dist23 < maxDistance) {
      if (dist13 < dist23) {
          minDistance = dist13;
          if (closestNeighbour !== dist13Name) {
              swapColors();
          }
          closestNeighbour = dist13Name;
          strokeWeight(map(dist13, 0, maxDistance, 2, 0.5));
          line(x1, y1, x3, y3);
      } else {
          minDistance = dist23;
          if (closestNeighbour !== dist23Name) {
              swapColors();
          }
          closestNeighbour = dist23Name;
      }
      strokeWeight(map(dist23, 0, maxDistance, 2, 0.5));
      line(x2, y2, x3, y3);
  }
}

function mouseMoved() {
    if (frameCount % 5 === 0 && ably?.connection.state === 'connected') {
        channel.publish(coordinatesMessage, {
            coordinate3,
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
    await connectAbly('sketch3');
}
