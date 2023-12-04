"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;
const filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}

fs.watch(filename, () => {
  let ls = spawn("ls", ["-lh", filename]),
    //
    output = "";
  //Adds an event listener (with .on()) and listens for the "data" event on the ChildProcess output stream and appends it to "output"
  ls.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  //Listens for the "close" event on the ChildProcess itself and, upon closure, logs a message with the contents
  ls.on("close", () => {
    let parts = output.split(/\s+/);
    console.dir([parts[0], parts[4], parts[8]]);
  });
});

console.log("Now watching " + filename + " for changes...");
