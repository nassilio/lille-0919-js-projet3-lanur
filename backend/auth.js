const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("./passport-strategies.js");

const {
  CONFIG: { jwtSecret, saltRounds },
  db
} = require("./conf");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  const formData = req.body;
  bcrypt.hash(formData.password, parseInt(saltRounds), (err, hash) => {
    formData.password = hash;
    const newUser = formData;
    db.query("INSERT INTO user SET ?", [newUser], (err, results) => {
      if (err) {
        return res.status(400).send(err.sqlMessage);
      }
      newUser.password = undefined;
      newUser.id = results.insertId
      return res.status(201).send({
        user: newUser,
        token: jwt.sign(JSON.stringify(newUser), jwtSecret)
      });
    });
  });
});

router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      // User not logged in (inexistant or tech error)
      return res.status(401).json({
        message: "Failed auth!",
        user,
        err,
        info
      });
    }
    req.login(user, { session: false }, loginErr => {
      if (loginErr) {
        // Failed (technically) to log the user in
        return res.status(401).json({
          message: "Couldn't log you in!",
          user,
          loginErr
        });
      }
      user.password = undefined;
      const token = jwt.sign(user, jwtSecret);
      return res.status(200).json({ user, token });
    });
  })(req, res);
});

module.exports = router;
