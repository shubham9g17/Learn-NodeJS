const EventEmitter = require("events");
var url = "";
class Logger extends EventEmitter {
  log(message) {
    // Send an Request to Logger Service
    console.log(message);
    // Raise an Event
    this.on("Message Loaded", () => {
      console.log("hi");
    });
    this.emit("Message Loaded", { id: "1", name: "sg" });
  }
}

module.exports = Logger;
