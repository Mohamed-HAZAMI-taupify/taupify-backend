const express = require("express");
const router = express.Router();
const url = require("url");
const Prospect = require("../models/Contact.model");
const { check, validationResult } = require("express-validator");
const ProspectCatalogue = require("../models/CatalogProspect.model");
const filterController = require("../controllers/filter.controller");
const Contact = require("../models/Contact.model");
const Archive = require("../models/LostClient.model");
const ProspectTest = require("../models/FakeClient.model");
const authentification = require("../middleware/auth");

router.post(
  "/",
  [
    check("firstname", "Ce champs est obligatoire").not().isEmpty(),
    check("lastname", "Ce champs est obligatoire").not().isEmpty(),
    check("phone", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res, next) => {
    const {
      firstname,
      lastname,
      email,
      phone,
      prospectType,
      essaie,
      comment,
      subscribe,
    } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let prospect = await Prospect.findOne({ email });
      if (prospect) {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      let prospectCat = await ProspectCatalogue.findOne({ email });
      if (prospectCat) {
        const pc = await ProspectCatalogue.findByIdAndUpdate(prospectCat._id, {
          isSubscribed: true,
        });
      }
      prospect = new Prospect({
        firstname,
        lastname,
        email,
        phone,
        prospectType,
        essaie,
        comment,
        subscribe,
      });
      await prospect.save();
      res.json(prospect);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);
router
  .route("/:id")
  .put(
    [
      check("firstname", "Ce champs est obligatoire").not().isEmpty(),
      check("lastname", "Ce champs est obligatoire").not().isEmpty(),
      check("phone", "Ce champs est obligatoire").not().isEmpty(),
      check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        await Prospect.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).send("prospect updated successfully");
      } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
      }
    }
  );
router.route("/update-subscription/:id").put(async (req, res, next) => {
  try {
    await Prospect.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).send("subscribe updated successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});
router.route("/is-subscribed/:id").get((req, res, next) => {
  // Prospect.findById(req.params.id, (error, data) => {
  //   if (error) {
  //     return next(error);
  //   } else {
  //     res.json(data.subscribe);
  //   }
  // });
});
router.get("/", (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = filterController.filterContactList(query, req, res);
  try {
    skip = Number(req.query.page) * 50;
    Prospect.find(filter, undefined, { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/create_contact", async (req, res, next) => {
  try {
    await ProspectTest.find({}).exec(req.body, async (error, data) => {
      if (error) {
        return next(error);
      } else {
        await data.map(async (t) => {
          let contact = {
            givenName: t.firstname,
            familyName: t.lastname,
            email: t.email,
            mobile: t.phone,
            sourceId: "admin",
            state: "fake_client",
            createdAt: t.date,
            subscribe: t.subscribe,
          };
          var newContact = new Contact(contact);
          await newContact.save();
        });
      }
    });

    res.send("liste des prospects convertis avec succès");
  } catch (err) {
    res.status(500).send();
  }
});

router.route("/prospect-of-type-site").get((req, res, next) => {
  Prospect.find({ prospectType: "EVEREST web" || "" }).exec(
    req.body,
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        dataDate = data.map((e) => e.date);

        res.json(dataDate);
      }
    }
  );
});

router.route("/:id").delete(async (req, res, next) => {
  try {
    let prospect = await Prospect.findById(req.params.id);
    let emailProsCat = await prospect.email;
    let exist = await ProspectCatalogue.find({ email: emailProsCat });
    if (exist) {
      Promise.all(
        exist.map(async (e) => {
          const pc = await ProspectCatalogue.findByIdAndUpdate(e._id, {
            isSubscribed: false,
          });
        })
      );
    }
    const deleted = await Prospect.findByIdAndRemove(req.params.id);
    res.send(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
