const express = require("express");
const router = express.Router();
const Survey = require("../models/SondageEmail.model");
const { findById, Update,post , getData } = require("../controllers/rest-api/crud.controller");

router.post("/add", (req, res, next) => {
  const { doesAgree } = req.body;
  res.json(
    post(Survey, {
      doesAgree,
    })
  );
});
router.put("/:id", (req, res, next) => {
  return Update(Survey, req, res, next);
});
router.get("/:id", (req, res, next) => {
  return findById(Survey, req.params.id, res, next);
});
router.get("/", async (req, res) => {
  const surveyResponse = await getData(Survey, res );
  return(surveyResponse);
});


module.exports = router;
