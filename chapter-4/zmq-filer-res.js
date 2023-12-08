"use strict";

const fs = require("fs");
const zmq = require("zeromq");

const responder = zmq.socket("rep");
const port = 8080;

// Binding the responder to a TCP port
responder.bind(`tcp://127.0.0.1:${port}`, (err) => {
  if (err) throw err;
  console.log(`Listening for zmq requesters on port: ${port}`);
});

//handle incoming requests
responder.on("message", (data) => {
  //parse incoming message
  let request = JSON.parse(data);
  console.log("Received request to get: " + request.path);

  //read file and reply with content
  fs.readFile(request.path, (err, content) => {
    console.log("Sending response content");
    responder.send(
      JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid,
      })
    );
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  responder.close();
});
