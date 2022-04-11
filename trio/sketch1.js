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
    color1 = color('#FF0080');
    color2 = color('#0080FF');
    minDistance = dist12;
    closestNeighbour = dist12Name;
    setDefaultCoordinates();
    c = true;
    origX2 = coordinate2.x.pos;
    origY2 = coordinate2.y.pos;
}

function draw() {
    const fillColor = c === true ? light : dark;
    const strokeColor = c === true ? color2 : color1;
    background(fillColor, 50);
    coordinate1.x.pos = mouseX;
    coordinate1.y.pos = mouseY;
    const noiseOffSet = 0.1;
    if (isSimulation) {
        drawSimulatedCoordinate2(noiseOffSet);
        drawSimulatedCoordinate3(noiseOffSet * 8);
    }
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
    if (dist12 < maxDistance || dist13 < maxDistance) {
        if (dist12 < dist13) {
            minDistance = dist12;
            if (closestNeighbour !== dist12Name) {
                swapColors();
            }
            closestNeighbour = dist12Name;
            strokeWeight(map(dist12, 0, maxDistance, 2, 0.5));
            line(x1, y1, x2, y2);
        } else {
            minDistance = dist13;
            if (closestNeighbour !== dist13Name) {
                swapColors();
            }
            closestNeighbour = dist13Name;
            strokeWeight(map(dist13, 0, maxDistance, 2, 0.5));
            line(x1, y1, x3, y3);
        }
    }
}

function mouseMoved() {
    if (frameCount % 5 === 0 && ably?.connection.state === 'connected') {
        channel.publish(coordinatesMessage, {
            coordinate1,
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
    await connectAbly('sketch1');
}
