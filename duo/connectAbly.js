let ably;
let channel;
const channelName = "collabCreativeCoding";

async function connectAbly() {
    const isConnected = ably?.connection.state === "connected";
    if (!isConnected) {
      const apiKey = select("#ablyApiKey").value();
      const clientOptions = { key: apiKey, clientId: "sketch1", echoMessages: false };
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
      channel.subscribe((message) => {
        x = message.data.x ?? x;
        y = message.data.y ?? y;
      });
    } else {
      ably.close();
    }
  }