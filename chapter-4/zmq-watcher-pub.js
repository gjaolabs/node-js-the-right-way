const zmq = require("zeromq");
const fs = require("fs");

const publisher = zmq.socket("pub");
const filename = process.argv[2];
const port = 8080;

// Binding the publisher to a TCP port
publisher.bind(`tcp://127.0.0.1:${port}`, (err) => {
  if (err) throw err;
  console.log(`Publisher bound to port ${port}`);
});

fs.watch(filename, (event, filename) => {
  // send message to any subscribers
  console.log(event);
  publisher.send(
    JSON.stringify({
      type: "changed",
      file: filename,
      timestamp: Date.now(),
    })
  );
});

process.on("SIGINT", () => {
  publisher.close();
  console.log("Publisher closed");
  process.exit();
});
