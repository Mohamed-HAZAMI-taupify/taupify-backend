const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const url = require("url");
const {
  returnInputsRequirementErrors, uniquenessRequired,
} = require("../../controllers/inputs.controller");

const filterController = require("../../controllers/filter.controller");
const {
  getFiltered,
  post,
  remove,
  findById,
} = require("../../controllers/rest-api/crud.controller");
const {
  getMastersWithTheirSlaves,
} = require("../../controllers/rest-api/related-models/ManyToOne.controller");
const LemonOneContact = require("../../models/lemon-one/Contact.model");

// router.route("/").get( async (req, res, next) => {
//   const query = url.parse(req.url, true).query;
//   const filter = {};
//   if (query.searchResult) {
//     const searchResult = new RegExp(query.searchResult, "i");
//     filter.$or = [
//       { firstname: searchResult },
//       { lastname: searchResult },
//       { email: searchResult },
//     ];
//   }
//   if (query.searchMonth) {
//     filter.$expr = {
//       $eq: [{ $month: "$date" }, parseInt(query.searchMonth)],
//     };
//   }
//   if (req.query.searchDateState == "true") {
//     filter.date = {
//       $gte: query.searchDateResult.split("T")[0] + "T" + "00:00:00.000Z",
//       $lt: query.searchDateResult.split("T")[0] + "T" + "23:59:59.000Z",
//     };
//   }
//   const contactsLemonOne = await getFiltered(req, LemonOneContact, "lemonOneContacts", filter, 3600);
//   res.send(contactsLemonOne);
// });

router.route("/").get((req, res, next) => {
  const query = url.parse(req.url, true).query;
  skip = Number(req.query.page) * 50;
   const filter = filterController.filterBackOfficeList(query);
  try {
    LemonOneContact.find(filter, undefined , { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});


// router.post(
//   "/",
//   [
//     check("givenName", "Ce champs est obligatoire").not().isEmpty(),
//     check("familyName", "Ce champs est obligatoire").not().isEmpty(),
//     check("club", "Ce champs est obligatoire").not().isEmpty(),
//     check("mobile", "Ce champs est obligatoire").not().isEmpty(),
//     check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
//   ],
//   async (req, res, next) => {
//     const {
//       givenName,
//       familyName,
//       birthDate,
//       mobile,
//       email,
//       club,
//       deliverableMail,
//       motivation,
//     } = req.body;
//     returnInputsRequirementErrors(req, res);
//     uniquenessRequired(
//       LemonOneContact,
//       { email },
//       "L'adresse e-mail existe déjà!",
//       "email",
//       res
//     );
//     contact = await post(
//       LemonOneContact,
//       {
//         givenName,
//         familyName,
//         birthDate,
//         mobile,
//         email,
//         club,
//         deliverableMail,
//         motivation,
//       },
//       "lemonOneContacts"
//     );
//     res.json(contact);
//   }
// );

router.post(
  "/",
  [
    check("givenName", "Ce champs est obligatoire").not().isEmpty(),
    check("familyName", "Ce champs est obligatoire").not().isEmpty(),
    check("club", "Ce champs est obligatoire").not().isEmpty(),
    check("mobile", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res) => {
    const {
      givenName,
      familyName,
      birthDate,
      mobile,
      email,
      club,
      deliverableMail,
      motivation,
    } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let contact = await LemonOneContact.findOne({ email });
      if (contact) {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      contact = new LemonOneContact({
        givenName,
        familyName,
        birthDate,
        mobile,
        email,
        club,
        deliverableMail,
        motivation,
    
      });
      await contact.save();
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);


// router.route("/:id").delete((req, res, next) => {
//   return remove(LemonOneContact, req.params.id, res, next, "lemonOneContacts");
// });
// router.route("/:id").get((req, res) => {
//   findById(LemonOneContact, req.params.id, res, next);
// });
router.route("/:id").get((req, res) => {
  LemonOneContact.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/:id").delete((req, res, next) => {
  LemonOneContact.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
})
module.exports = router;
