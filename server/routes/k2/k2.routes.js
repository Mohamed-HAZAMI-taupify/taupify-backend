const express = require("express");
const router = express.Router();
const url = require("url");
const { check, validationResult } = require("express-validator");
const K2Contact = require("../../models/k2/K2.model");
const filterController = require("../../controllers/filter.controller");

router.route("/").get((req, res, next) => {
  const query = url.parse(req.url, true).query;
  skip = Number(req.query.page) * 50;
   const filter = filterController.filterBackOfficeList(query);
  try {
    K2Contact.find(filter, undefined , { skip, limit: 50 })
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
    const {
      givenName,
      familyName,
      mobile,
      email,
    } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let contact = await K2Contact.findOne({ email });
      if (contact) {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      contact = new K2Contact({
        givenName,
        familyName,
        mobile,
        email,
    
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
  K2Contact.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});
router.route("/:id").get((req, res) => {
  K2Contact.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
