const express = require("express");
const courses = require("./routes/courses");
const home = require("./routes/home");
// const config = require("config");
// const helmet = require("helmet");
// const morgan = require("morgan");
const logger = require("./middleware/logger");
const app = express();
app.set("view engine", "pug");

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(logger);
app.use("/api/courses", courses);
app.use("/", home);
// app.use(helmet());

// console.log("App Name:" + config.get("name"));
// console.log("Password:" + config.get("mail.password"));

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   console.log("Morgan Enabled");
// }

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
