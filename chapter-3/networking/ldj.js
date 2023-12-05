// Line delimited JSON. LDJClient inherits from EventEmitter

const EventEmitter = require("events");

// LDJClient class definition
class LDJClient extends EventEmitter {
  constructor(stream) {
    // Call the EventEmitter constructor
    super();
    // Initialize buffer for accumulating data chunks
    this.buffer = "";

    // Listen for 'data' events on the stream
    stream.on("data", (data) => {
      // Accumulate incoming data chunks from the stream
      this.buffer += data;

      // Scan for newline characters (delimiter in JSON object)
      let boundary = this.buffer.indexOf("\n");

      // Cycle the stream while there is a newline character
      while (boundary !== -1) {
        // Extract a message from the buffer, assign it to input,
        // and emit it as a 'message' event with the parsed JSON
        let input = this.buffer.substring(0, boundary);
        this.buffer = this.buffer.substring(boundary + 1);
        this.emit("message", JSON.parse(input));
        boundary = this.buffer.indexOf("\n");
      }
    });
  }
}

// Export LDJClient class and a connect function
exports.LDJClient = LDJClient;
exports.connect = (stream) => {
  return new LDJClient(stream);
};
