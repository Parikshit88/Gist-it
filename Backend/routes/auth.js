const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ViscaElBarca$ViscaElCatalunya";

//Route 1: create a user using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Please enter a password containing of at least 7 characters"
    ).isLength({ min: 7 }),
  ],
  async (req, res) => {
    let success = false
    // if there are errors, return bad request
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(404).json({success, result: result.array() });
      }
      //Check whether the user with same email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //   res.json(user);
      success=true
      res.json({success, authToken });
    } catch (error) {
      //catch error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 2: authenticate a user using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors, return bad request
let success = false;
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(404).json({ result: result.array() });
      }
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //   res.json(user);
      success = true;
      res.json({ success,authToken });
    } catch (error) {
      //catch error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 3 : Get LogIn details using: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    //catch error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
