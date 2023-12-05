"use strict"

const fs = require("fs");
const net = require("net")

const port = 8080;
const filename = process.argv[2]

//Creates a TCP server that responds a JSON to the client/subscriber (at port 8080) when modifications to "target.exe" file take place
const server = net.createServer((connection) => {
    console.log("Subscriber connected.")
    connection.write(JSON.stringify({
        type: "watching",
        file: filename
    }) + "\n");

    //Listens for events on "target.exe" and notifies the client/subscriber with a JSON 
    let watcher = fs.watch(filename, () => {
        connection.write(JSON.stringify({
            type: "changed",
            file: filename,
            timestamp: Date.now()
        }) + "\n")

    })

    //Listens for the "close" event and appropriately closes the watcher process
    connection.on("close", () => {
        console.log("Subscriber disconnected.")
        watcher.close()
    })
})

if(!filename){
    throw Error("No target filename was specified.")
}

server.listen(port, () => {
    console.log(`Listening for subscribers on port ${port}...`)
})

//Start sparate terminal processes
//One for node via process.argv i.e. node net-watcher.js target.exe
//One for client/subscriber i.e. telnet localhost 8080
//One for manipulating the file i.e. touch target.txt