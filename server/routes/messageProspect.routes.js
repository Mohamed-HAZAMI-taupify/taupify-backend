const express = require("express");
const router = express.Router();
const url = require("url");
const ContactUsProspect = require("../models/MessageProspect.model");
const { check, validationResult } = require("express-validator");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const {
  post,
  remove,
  findById,
  update,
} = require("../controllers/rest-api/crud.controller");
const {
  getMastersWithTheirSlaves,
} = require("../controllers/rest-api/related-models/ManyToOne.controller");

router.post(
  "/",
  [
    check("message", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Ce champs est obligatoire").not().isEmpty(),
  ],
  async (req, res, next) => {
    const { contact, email, message } = req.body;
    returnInputsRequirementErrors(req, res);
    const contactUsProspect = await post(
      ContactUsProspect,
      {
        contact,
        message,
        email,
      },
      "contactUsProspects"
    );
    res.send(contactUsProspect);
  }
);

router.get("/contact-exist/:email", async (req, res, next) => {
  return getMastersWithTheirSlaves(
    res,
    ContactUsProspect,
    "contact",
    "contactUsProspects",
    3600,
    { email: req.params.email },
    []
  );
});

router.route("/").get((req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = {};

  if (query.searching) {
    const searching = new RegExp(query.searching, "i");
    filter.$or = [
      { firstname: searching },
      { lastname: searching },
      { email: searching },
    ];
  }
  if (query.searchMonth) {
    filter.$expr = {
      $eq: [{ $month: "$date" }, parseInt(query.searchMonth)],
    };
  }
  if (req.query.searchDateState == "true") {
    filter.date = {
      $gte: query.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
      $lt: query.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
    };
  }
  try {
    skip = Number(req.query.page) * 50;
    ContactUsProspect.find(filter, undefined, { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
router.route("/:id").delete(async (req, res, next) => {
  return remove(
    ContactUsProspect,
    req.params.id,
    res,
    next,
    "contactUsProspects"
  );
});
router.route("/:id").get(async (req, res, next) => {
  return findById(ContactUsProspect, req.params.id, res, next);
});
router.route("/:id").put(async (req, res, next) => {
  return update(
    ContactUsProspect,
    req.params.id,
    req,
    res,
    next,
    "contactUsProspects"
  );
});
module.exports = router;
