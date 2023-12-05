const fs = require("fs");
//Watches (listens) for a change to occur with the target file (target.txt)


fs.watch("./target.txt", () => {
  console.log("File target.txt just changed!")
})

console.log("Now watching target.txt for changes")