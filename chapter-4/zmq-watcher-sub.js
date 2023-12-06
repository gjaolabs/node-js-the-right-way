const zmq = require("zeromq");

const subscriber = zmq.socket("sub");

const port = 8080;

// Connect to the publisher
try {
  subscriber.connect(`tcp://127.0.0.1:${port}`);
  console.log(`Subscriber connected to Publisher at port ${port}`);
} catch (error) {
  console.error("Error: ", error);
}
// Subscribe to the specified filter. Empty string for no filter
subscriber.subscribe("");

subscriber.on("message", (data) => {
  let message = JSON.parse(data),
    date = new Date(message.timestamp);
  console.log("File '" + message.file + "' changed at " + date);
});

process.on("SIGINT", () => {
  subscriber.close();
  console.log("Subscriber closed");
  process.exit();
});
