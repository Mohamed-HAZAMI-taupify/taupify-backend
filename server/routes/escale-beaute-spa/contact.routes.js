const express = require("express");
const router = express.Router();
const ContactEscaleSpa = require("../../models/escale-beaute-spa/Contact.model");
const { check, validationResult } = require("express-validator");
const url = require("url");
const {
  returnInputsRequirementErrors,
} = require("../../controllers/inputs.controller");
const filterController = require("../../controllers/filter.controller");
const {
  post,
  remove,
  update,
  findById,
  getData,
} = require("../../controllers/rest-api/crud.controller");

router.post(
  "/add",
  [
    check("familyName", "Veuillez entrer votre Nom s'il vous plait")
      .not()
      .isEmpty(),
    check("givenName", "Veuillez entrer votre Prénom s'il vous plait")
      .not()
      .isEmpty(),
    check("mobile", "Veuillez entrer votre Numéro de Téléphone s'il vous plait")
      .not()
      .isEmpty(),
    check("email", "Veuillez entrer votre e-mail s'il vous plait")
      .not()
      .isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res, next) => {
    const { familyName, givenName, email, mobile, message } = req.body;
    await returnInputsRequirementErrors(req, res);
    uniquenessRequired(
      ContactEscaleSpa,
      { email },
      "L'adresse e-mail existe déjà!",
      "email",
      res
    );

    contact = await post(ContactEscaleSpa, req.body, "escaleBeautycontacts");
    res.json(contact);
  }
);

router.route("/").get(async (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = filterController.filterBackOfficeList(query);
  const contactSpa = await getData(ContactEscaleSpa, res, req, filter);
  return contactSpa;
});

router.route("/:id").delete((req, res, next) => {
  return remove(ContactEscaleSpa, req, res, next, "escaleBeautycontacts");
});

router.put("/:id", (req, res, next) => {
  return update(ContactEscaleSpa, req, res, next, "escaleBeautycontacts");
});

router.route("/:id").get((req, res, next) => {
  return findById(ContactEscaleSpa, req, res, next, "escaleBeautycontacts");
});

module.exports = router;
