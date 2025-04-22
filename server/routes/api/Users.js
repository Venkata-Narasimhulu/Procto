const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/Users");

/**
 * @route   POST /api/users/register
 * @desc    Register user (student or professor)
 * @access  Public
 */
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log("Incoming registration data:", req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists in database" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        collegeId: req.body.collegeId,
        password: req.body.password,
        userType: req.body.userType,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user =>
              res.status(200).json({
                email: user.email,
                name: user.name,
                collegeId: user.collegeId,
                userType: user.userType
              })
            )
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * @route   POST /api/users/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched - create payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          collegeId: user.collegeId, // ✅ included
          userType: user.userType
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 31556926 }, // 1 year
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
