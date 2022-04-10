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
    color1 = color('#0080FF');
    color2 = color('#80FF00');
    minDistance = dist12;
    closestNeighbour = dist12Name;
    setDefaultCoordinates();
    c = true;
}

function draw() {
    const fillColor = c === true ? light : dark;
    const strokeColor = c === true ? color1 : color2;

    background(fillColor, 50);
    coordinate2.x.pos = mouseX;
    coordinate2.y.pos = mouseY;
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
    const maxDistance = windowWidth;
    if (dist12 < maxDistance || dist23 < maxDistance) {
        if (dist12 < dist23) {
            minDistance = dist12;
            if (closestNeighbour !== dist12Name) {
                swapColors();
            }
            closestNeighbour = dist12Name;
            strokeWeight(map(dist12, 0, maxDistance, 2, 0.5));
            line(x1, y1, x2, y2);
        } else {
            minDistance = dist23;
            if (closestNeighbour !== dist23Name) {
                swapColors();
            }
            closestNeighbour = dist23Name;
            strokeWeight(map(dist23, 0, maxDistance, 2, 0.5));
            line(x2, y2, x3, y3);
        }
    }
}

function mouseMoved() {
    if (frameCount % 5 === 0 && ably?.connection.state === 'connected') {
        channel.publish(coordinatesMessage, {
            coordinate2,
        });
    }
}

function mouseClicked() {
    c = !c;
    if (ably?.connection.state === 'connected') {
        channel.publish(clickMessage, { c });
    }
}

async function connectClient() {
    await connectAbly('sketch2');
}
