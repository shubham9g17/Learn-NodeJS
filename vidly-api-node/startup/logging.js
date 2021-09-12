require("express-async-errors");
const winston = require("winston");

module.exports = function () {
  winston.add(new winston.transports.Console({ level: "info" }));
  winston.add(
    new winston.transports.File({ filename: "Errors.log", level: "error" })
  );
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "ExceptionsAndRejections.log",
      handleExceptions: true,
      handleRejections: true,
    })
  );
};
