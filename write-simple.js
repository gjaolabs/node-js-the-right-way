const fs = require("fs");

fs.writeFile("target.txt", "a witty message", (err) => {
  if (err) {
    throw err;
  }
  console.log("File saved!");
});
