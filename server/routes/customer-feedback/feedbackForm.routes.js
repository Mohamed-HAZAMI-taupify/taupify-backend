const express = require("express");
const { post } = require("../../controllers/rest-api/crud.controller");
const {
  getMastersWithTheirSlaves,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const router = express.Router();
const Feedbackform = require("../../models/customer-feedback/FeedbackForm.model");

router.post("/", async (req, res, next) => {
  const { message } = req.body;
  const feedback = await post(Feedbackform, {
    message,
  },"feedbackforms");
  res.json(feedback);
});

router.get("/", (req, res) => {
  return getMastersWithTheirSlaves(
    res,
    Feedbackform,
    "answers",
    "feedbackforms",
    3600,
    {},
    []
  );
});
module.exports = router;
