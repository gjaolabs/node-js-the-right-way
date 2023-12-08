"use strict";

const zmq = require("zeromq");
const filename = process.argv[2];
const port = 8080;
//create request endpoint
const requester = zmq.socket("req");
//connect to TCP port
try {
  requester.connect(`tcp://localhost:${port}`);
  console.log(`Requester connected to Responder at port ${port}`);
} catch (error) {
  console.error("Error: ", error);
}
//set event handler to handle replies from responder
requester.on("message", (data) => {
  let response = JSON.parse(data);
  console.log("Received response: ", response);
});

//send request to responder for content
for (let i = 0; i < 3; i++) {
  console.log("Sending request for ", +filename);
  try {
    requester.send(
      JSON.stringify({
        path: filename,
      })
    );
  } catch (err) {
    console.error("Error sending request ", err);
  }
}
//close if interrupted
process.on("SIGINT", () => {
  requester.close();
  console.log("Requester closed");
  process.exit();
});
