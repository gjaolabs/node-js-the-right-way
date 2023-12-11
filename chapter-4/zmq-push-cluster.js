"use strict";
const cluster = require("cluster");
const zmq = require("zeromq");
const port = 8080;

if (cluster.isMaster) {
  //master process
  //Create a PUSH socket and bind it to an IPC endpoint—this socket will be for sending jobs to the workers.
  const push = zmq.socket("push").bind("ipc://push-messaging.ipc");
  //Create a PULL socket and bind to a different IPC endpoint—this socket will receive messages from workers.
  const pull = zmq.socket("pull").bind("ipc://pull-messaging.ipc");
  //Keep a count of ready workers (initialized to 0).
  let readyCount = 0;
  //Listen for messages on the PULL socket
  pull.on("message", (data) => {
    const message = JSON.parse(data);
    //If the message is a ready message, increment the ready counter
    if (message.ready) {
      readyCount++;
      //When the ready counter reaches 3, send thirty job messages out through the PUSH socket
      if (readyCount === 3) {
        for (let i = 0; i < 30; i++) {
          push.send(JSON.stringify({ index: i }));
        }
      }
    }
    //If the message is a result message, output it to the console
    else if (message.result) {
      console.log("Received: " + data);
    }
  });
  //Spin up three worker processes
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }
  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  //Each worker process should
  //Create a PULL socket and connect it to the master’s PUSH endpoint
  const pull = zmq.socket("pull").connect("ipc://push-messaging.ipc");
  //Create a PUSH socket and connect it to the master’s PULL endpoint.
  const push = zmq.socket("push").connect("ipc://pull-messaging.ipc");
  //Listen for messages on the PULL socket
  //Treat this as a job and respond by sending a result message out on the PUSH socket
  pull.on("message", (data) => {
    const job = JSON.parse(data);
    console.log(`${process.pid} received job: ${job.index}`);

    push.send(
      JSON.stringify({
        index: job.index,
        pid: process.pid,
        result: "success",
      })
    );
  });
  //Send a ready message out on the PUSH socket
  push.send(
    JSON.stringify({
      ready: true,
      pid: process.pid,
    })
  );
}
