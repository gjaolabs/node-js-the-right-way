"use strict";
const cluster = require("cluster");
const fs = require("fs");
const zmq = require("zeromq");
const port = 8080;

if (cluster.isMaster) {
  // master process - create ROUTER and DEALER sockets, bind endpoints
  const router = zmq.socket("router").bind(`tcp://127.0.0.1:${port}`);
  const dealer = zmq.socket("dealer").bind("ipc://filer-dealer.ipc");

  // forward messages between router and dealer
  router.on("message", (...frames) => {
    dealer.send(frames);
  });

  dealer.on("message", (...frames) => {
    router.send(frames);
  });

  // listen for workers to come online
  cluster.on("online", (worker) => {
    console.log("Worker " + worker.process.pid + " is online.");
  });

  // fork three worker processes
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }
} else {
  // worker process - create REP socket, connect to DEALER
  let responder = zmq.socket("rep").connect("ipc://filer-dealer.ipc");

  responder.on("message", (data) => {
    // parse incoming message
    let request = JSON.parse(data);
    console.log(process.pid + " received request for: " + request.path);

    // read file and reply with content
    fs.readFile(request.path, (err, data) => {
      if (err) {
        console.error(process.pid + " error reading file:", err.message);
        responder.send(
          JSON.stringify({
            pid: process.pid,
            error: err.message,
            timestamp: Date.now(),
          })
        );
      } else {
        console.log(process.pid + " sending response");
        responder.send(
          JSON.stringify({
            pid: process.pid,
            data: data.toString(),
            timestamp: Date.now(),
          })
        );
      }
    });
  });
}
