const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
router.get("/", async (req, res) => {
  returnInputsRequirementErrors(req, res);
  try {
    const salt = await bcrypt.genSalt(10);
    const access_token = jwt.sign(
      { client_id: "everestclientId" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 360000,
      }
    );
    res.send({ access_token: access_token, expires_in: 3600 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
