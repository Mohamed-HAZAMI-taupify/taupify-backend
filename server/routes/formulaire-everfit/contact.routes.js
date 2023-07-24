const express = require("express");
const router = express.Router();
const url = require("url");
const { check, validationResult } = require("express-validator");
const Contact = require("../../models/formulaire-everfit/Contact.model");
const filterController = require("../../controllers/filter.controller");

router.route("/").get((req, res, next) => {
    const query = url.parse(req.url, true).query;
     const filter = filterController.filterBackOfficeList(query);
    try {
        Contact.find(filter)
        .sort({ _id: -1 })
        .exec(req.body, (error, data) => {
          res.json(data);
        });
    } catch (e) {
      res.status(500).send();
    }
  });
  

router.post(
  "/",
  [
    check("givenName", "Ce champs est obligatoire").not().isEmpty(),
    check("familyName", "Ce champs est obligatoire").not().isEmpty(),
    check("mobile", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res) => {
    const { givenName, familyName, mobile, email, subscribe , BPJEPSAF,certificate } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let contact = await Contact.findOne({ email });
      if (contact) {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      contact = new Contact({
        givenName,
        familyName,
        mobile,
        email,
        subscribe,
        BPJEPSAF,
        certificate,
      });
      await contact.save();
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

router.route("/:id").delete((req, res, next) => {
    Contact.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: "delete succefully",
      });
    }
  });
});

router.route("/:id").get((req, res) => {
    Contact.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});
module.exports = router;

