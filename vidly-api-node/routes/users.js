const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");

//Getting Current User
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//Register a New User
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already Registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(9);
  user.password = await bcrypt.hash(user.password, salt);
  const token = user.generateAuthToken();
  await user.save();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
