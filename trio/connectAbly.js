let ably;
let channel;
const channelName = "collabCreativeCoding";
const coordinatesMessage = "coordinate";
const clickMessage = "click";
const abValueMessage = "abValue";

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
      x = message.data.x ?? x;
      y = message.data.y ?? y;
    });
    channel.subscribe(abValueMessage, (message) => {
      ab = message.data.ab ?? ab;
    });
    channel.subscribe(clickMessage, (message) => {
      c = message.data.c ?? c;
    });
  } else {
    ably.close();
  }
}
