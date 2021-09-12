const http = require("http");
const Logger = require("./logger");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write(" You are Talking to SG's Server ");
    res.end();
  }
});
const logger = new Logger();
logger.log("hi sg");

server.listen(8080);
console.log("Listening on Port 3001");
