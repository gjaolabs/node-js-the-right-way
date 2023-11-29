const fs = require ("fs");
//Uses process.argv to read the command-line arguments (argument vector argv) 
const filename =  process.argv[2];

if(!filename){
  throw Error("A file to watch must be specified!")
}
fs.watch(filename, () => {
  console.log("File " + filename + " just changed!");
})

console.log("Now watching " + filename + " for changes...");

//node watcher-argv.js target.txt