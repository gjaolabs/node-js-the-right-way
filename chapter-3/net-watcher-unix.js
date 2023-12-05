"use strict"

const fs = require("fs");
const net = require("net")

const port = 8080;
const filename = process.argv[2]

//Creates a TCP server that writes to the client/subscriber (at port 8080) when modifications to "target.exe" file take place
const server = net.createServer((connection) => {
    console.log("Subscriber connected.")
    connection.write("Now watching " + filename + " for changes.\n");

    //Listens for events on "target.exe" and notifies the client/subscriber
    let watcher = fs.watch(filename, () => {
        connection.write("File " + filename + " changed at: " + Date.now() + "\n")

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

//Change port from 8080 to /tmp/watcher.sock for UNIX socket
server.listen("/tmp/watcher.sock", () => {
    console.log(`Listening for subscribers on port ${port}...`)
})

//Start sparate terminal processes
//One for node via process.argv i.e. node net-watcher-unix.js target.exe
//One for client/subscriber i.e. nc -U /tmp/watcher.sock
//One for manipulating the file i.e. touch target.txt