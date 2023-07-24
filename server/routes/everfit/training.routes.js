const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  returnInputsRequirementErrors,
} = require("../../controllers/inputs.controller");
const {
  post,
  getAll,
  update,
  remove,
} = require("../../controllers/rest-api/crud.controller");
const { getMastersWithTheirSlaves,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const Contact = require("../../models/everfit/Contact.model");
const Training = require("../../models/everfit/Training.model");

router.post(
  "/",
  [check("name", "Ce champs est obligatoire").not().isEmpty()],
  async (req, res) => {
    const { name } = req.body;
    try {
      let training = new Training({
        name,
      });
      await training.save();
      res.json(training);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);
router.delete("/:id", (req, res, next) => {
  return remove(Training, req.params.id, res, next, "trainings");
});
router.get("/", (req, res) => {
  return getMastersWithTheirSlaves(
    res,
    Training,
    "everfitContacts",
    "trainings",
    3600,
    {},
    []
  );
});
router.put("/:id",(req, res, next) => {
  return update(Training, req.params.id, req, res, next, "trainings");
});

module.exports = router;
