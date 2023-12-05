"use strict";

const net = require("net");
const ldj = require("./ldj");
const port = 8080;

const netClient = net.connect({ port: port });
const ldjClient = ldj.connect(netClient);

ldjClient.on("message", (message) => {
  console.log(message);
  if (message.type === "watching") {
    console.log("Now watching: " + message.file);
  } else if (message.type === "changed") {
    console.log(
      "File " + message.file + " changed at " + new Date(message.timestamp)
    );
  } else {
    throw Error("Unrecognized message type: " + message.type);
  }
});
