const express = require("express");
const router = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
const Answer = require("../../models/customer-feedback/Answer.model");
const Question = require("../../models/customer-feedback/Quesion.model");

const { check } = require("express-validator");
const {
  returnInputsRequirementErrors,
} = require("../../controllers/inputs.controller");
const {
  updateMasterWhenPostingSlave,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const {
  post,
  getAll,
  getFiltered,
  getFiltredPaginated,
} = require("../../controllers/rest-api/crud.controller");
const FeedbackForm = require("../../models/customer-feedback/FeedbackForm.model");

router.post(
  "/",
  [
    check(
      "question",
      " veuillez indiquer la question à laquelle vous voulez répondre!"
    )
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const { rate, question, feedbackForm } = req.body;

    await returnInputsRequirementErrors(req, res, next);
    const answer = await post(
      Answer,
      {
        rate,
        question,
        feedbackForm,
      },
      "answers"
    );
    await updateMasterWhenPostingSlave(
      Question,
      answer,
      "answers",
      req.body.question,
      "questions"
    );
    await updateMasterWhenPostingSlave(
      FeedbackForm,
      answer,
      "answers",
      req.body.feedbackForm,
      "feedbackforms"
    );
    res.json(answer);
  }
);
router.get("/", async (req, res, next) => {
  const answers = await getAll(Answer, "answers");
  res.send(answers);
});

module.exports = router;
