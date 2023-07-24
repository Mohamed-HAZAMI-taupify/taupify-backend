const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Axios = require("axios");
const url = require("url");
const TaupifyContact = require("../../models/taupify/Contact.model");
const {
  returnInputsRequirementErrors,
  uniquenessRequired,
} = require("../../controllers/inputs.controller");
const {
  post,

  findById,
  remove,
  getData,
} = require("../../controllers/rest-api/crud.controller");
router.post(
  "/",
  [
    check("givenName", "Ce champs est obligatoire").not().isEmpty(),
    check("familyName", "Ce champs est obligatoire").not().isEmpty(),
    check("phoneNumber", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res, next) => {
    const { givenName, familyName, phoneNumber, email, message } = req.body;
    await returnInputsRequirementErrors(req, res);
    uniquenessRequired(
      TaupifyContact,
      { email },
      "L'adresse e-mail existe déjà!",
      "email",
      res
    );

    contact = await post(TaupifyContact, req.body, "taupifycontacts");
    res.json(contact);
  }
);
router.route("/").get(async (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = {};

  if (query.searching) {
    const searching = new RegExp(query.searching, "i");
    filter.$or = [
      { givenName: searching },
      { familyName: searching },
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
  const ContactTaupify = await getData(TaupifyContact, res, req);
  return ContactTaupify;
});
router.route("/:id").get((req, res) => {
  return findById(TaupifyContact, id, res, next);
});
router.route("/:id").delete((req, res, next) => {
  return remove(TaupifyContact, id, res, next, "taupifycontacts");
});

module.exports = router;