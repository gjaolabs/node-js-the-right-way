//This service intentionally splits a message into multiple chunks

"use strict";

const net = require("net");
const port = 8080;

const server = net.createServer((connection) => {
  console.log("Subscriber connected.");

  //Send the first chunk
  connection.write('{"type":"changed","file":"targ');
  //Set timer to 1s and send the other chunk
  let timer = setTimeout(() => {
    connection.write('et.txt","timestamp":1358175758495}' + "\n");
    connection.end();
  }, 5000);

  //Clear timer when connection end event fires
  connection.on("end", () => {
    clearTimeout(timer);
    console.log("Subscriber disconnected");
  });
});

server.listen(port, () => {
  console.log(`Test server listening for subscribers on port ${port}`);
});
