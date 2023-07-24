const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const url = require("url");
const {
  returnInputsRequirementErrors,
  uniquenessRequired,
} = require("../../controllers/inputs.controller");
const {
  findById,
  update,
  remove,
  post,
  getData,
} = require("../../controllers/rest-api/crud.controller");
const {
  updateMasterWhenPostingSlave,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const EverfitContact = require("../../models/everfit/Contact.model");
const Training = require("../../models/everfit/Training.model");

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
      email,
      mobile,
      deliverableMail,
      motivation,
      source,
      BPJEPSAF,
      postalCode,
      certificate,
    } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let contact = await EverfitContact.findOne({ email });
      if (contact) {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      contact = new EverfitContact({
        givenName,
        familyName,
        email,
        mobile,
        deliverableMail,
        motivation,
        source,
        BPJEPSAF,
        postalCode,
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

// router.post(
//   "/",
//   [
//     check("givenName", "Ce champs est obligatoire").not().isEmpty(),
//     check("familyName", "Ce champs est obligatoire").not().isEmpty(),
//     check("mobile", "Ce champs est obligatoire").not().isEmpty(),
//     check("postalCode", "Ce champs est obligatoire").not().isEmpty(),
//     check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
//     check("training", "Ce champs est obligatoire").not().isEmpty(),
//   ],
//   async (req, res) => {
//     const {
//       givenName,
//       familyName,
//       email,
//       mobile,
//       deliverableMail,
//       motivation,
//       source,
//       BPJEPSAF,
//       postalCode,
//       certificate,
//     } = req.body;
//     await returnInputsRequirementErrors(req, res);
//     uniquenessRequired(
//       EverfitContact,
//       { email },
//       "L'adresse e-mail existe déjà!",
//       "email",
//       res
//     );
//     try {
//       const contact = await post(
//         EverfitContact,
//         {
//           givenName,
//           familyName,
//           email,
//           mobile,
//           deliverableMail,
//           motivation,
//           source,
//           BPJEPSAF,
//           postalCode,
//           certificate,
//         },
//         "everfitcontacts"
//       );

//       res.send(contact);
//     } catch (err) {
//       console.log(err.message);
//       res.status(500).send("server error");
//     }
//   }
// );

router.route("/").get(async (req, res, next) => {
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
  const ContactEverfit = await getData(EverfitContact, res, req);
  return ContactEverfit;
});
router
  .route("/:id")
  .put(
    [
      check("givenName", "Ce champs est obligatoire").not().isEmpty(),
      check("familyName", "Ce champs est obligatoire").not().isEmpty(),
      check("mobile", "Ce champs est obligatoire").not().isEmpty(),
      check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
      check("postalCode", "Ce champs est obligatoire").not().isEmpty(),
      check("training", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      returnInputsRequirementErrors(req, res);
      return update(
        EverfitContact,
        req.params.id,
        req,
        res,
        next,
        "everfitcontacts"
      );
    }
  );
router.route("/:id").get((req, res, next) => {
  return findById(EverfitContact, req.params.id, res, next);
});
// router.route("/:id").delete((req, res, next) => {
//   remove(EverfitContact, req.params.id, res, next, "everfitcontacts");
// });

router.route("/:id").delete((req, res, next) => {
  EverfitContact.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;