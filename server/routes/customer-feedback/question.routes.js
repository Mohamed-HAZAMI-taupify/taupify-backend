const express = require("express");
const {
  returnInputsRequirementErrors,
} = require("../../controllers/inputs.controller");
const {
  findById,
  update,
  post,
} = require("../../controllers/rest-api/crud.controller");
const { check } = require("express-validator");

const {
  getMastersWithTheirSlaves,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const router = express.Router();
const Question = require("../../models/customer-feedback/Quesion.model");

router.post(
  "/",
  [check("outOf", "Ce champs est obligatoire").not().isEmpty()],
  async (req, res, next) => {
    const { subject, outOf, type, label } = req.body;
    returnInputsRequirementErrors(req, res);
    const question = await post(
      Question,
      { subject, outOf, type, label },
      "questions"
    );
    res.json(question);
  }
);
router.get("/", (req, res) => {
  return getMastersWithTheirSlaves(
    res,
    Question,
    "answers",
    "questions",
    3600,
    {},
    []
  );
});
router.get("/:id", (req, res, next) => {
  return findById(Question, req.params.id, res, next);
});
router.put("/:id", (req, res, next) => {
  return update(Question, req.params.id, req, res, next, "questions");
});
module.exports = router;
