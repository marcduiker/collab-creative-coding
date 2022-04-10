let ably;
let channel;
const channelName = "collabCreativeCoding";
const coordinatesMessage = "coordinate"; // x, y positions with min and max values.
const clickMessage = "click"; // true or false

async function connectAbly(clientId) {
  const isConnected = ably?.connection.state === "connected";
  if (!isConnected) {
    const apiKey = select("#ablyApiKey").value();
    const clientOptions = {
      key: apiKey,
      clientId: clientId,
      echoMessages: false,
    };
    ably = new Ably.Realtime.Promise(clientOptions);
    ably.connection.on("connected", () => {
      console.log("Connected 🎉");
      select("#connectButton").elt.innerText = "Disconnect";
    });
    ably.connection.on("closed", () => {
      console.log("Disconnected 😿");
      select("#connectButton").elt.innerText = "Connect";
    });
    channel = await ably.channels.get(channelName);
    channel.subscribe(coordinatesMessage, (message) => {
      switch (message.clientId) {
        case "sketch1":
          coordinate1 = message.data.coordinate1 ?? coordinate1;
          break;
        case "sketch2":
          coordinate2 = message.data.coordinate2 ?? coordinate2;
          break;
        case "sketch3":
          coordinate3 = message.data.coordinate3 ?? coordinate3;
          break;
        default:
          break;
      }
    });
    channel.subscribe(clickMessage, (message) => {
      c = message.data.c ?? c;
    });
  } else {
    ably.close();
  }
}
