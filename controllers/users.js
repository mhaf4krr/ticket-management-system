const jwt = require("jsonwebtoken");
const express = require("express");

const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

/* User Schema */

const userSchema = new mongoose.Schema({
  concerned_dept: String,
  password: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  dept_name: String
});

/* Model Schema */

/* Method for Generating Tokens */

generateAuthToken = function(user) {
  const token = jwt.sign(
    {
      email: user.email,
      password: user.password,
      _id: user._id,
      login: true,
      dept_name: user.dept_name,
      concerned_dept: user.concerned_dept
    },
    "ourSecretPrivateKey"
  );
  return token;
};

const USER = mongoose.model("users", userSchema);

const router = express.Router();

router.post("/login", async (req, res) => {
  let user = await USER.findOne({ email: req.body.email });

  console.log(user);
  if (user === null) {
    res.send({ message: "Invalid Username or Password" });
  } else if (user.password === req.body.password) {
    const token = generateAuthToken(user);
    res.header("x-auth-token", token).send({
      payloadToken: token,
      message: `success`,
      login: true
    });
  } else res.send({ message: "Invalid Username or Password", login: false });
  /* invalid credentials */
});

router.get("/checkToken", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).send(false);
  }
  if (token) {
    try {
      const decodedInfo = jwt.verify(token, "ourSecretPrivateKey");
      if (decodedInfo.login === true) {
        res.send(decodedInfo);
      } else {
        res.render("login");
      }
    } catch (error) {
      console.log("Auth Failed");
      res.send(false);
    }
  }
});

router.get("/admin", (req, res) => {
  res.render("adminPannel");
});

module.exports = router;
