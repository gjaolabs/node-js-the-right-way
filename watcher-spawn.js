"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;
const filename = process.argv[2];

if (!filename){
  throw Error("A file to watch must be specified!");
}
//Spawns a ChildProcess object that has stdin, stdout and stderr methods for reading or writing data
// "ls", the spawned child process (which executes a shell command for "filename") has its standard output piped to to the standard output of the main process
fs.watch(filename, () => {
  let ls = spawn("ls", ["-lh", filename]);
  ls.stdout.pipe(process.stdout)
})

console.log("Now watching " + filename + " for changes...");