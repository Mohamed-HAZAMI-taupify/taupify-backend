const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Contact = require("../models/Contact.model");
const url = require("url");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const {
  post,
  update,
  findById,
  remove,
  getFiltered,
  getFiltredPaginated,
} = require("../controllers/rest-api/crud.controller");

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
    filter.$expr = { $eq: [{ $month: "$date" }, parseInt(query.searchMonth)] };
  }
  if (query.searchDateState == "true") {
    filter.date = {
      $gte: query.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
      $lt: query.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
    };
  }
  skip = Number(req.query.page) * 50;
  return getFiltered(req, Contact, "everestContacts", filter, 3600);
});

////////////////// TEST TO DELETE 
router.route("/filtered").get(async  (req, res, next) => { 
const listPerPage = await getFiltredPaginated(
  Contact,
  {},
  req.query.page,
 100,
  "everestContacts"
);
res.send(listPerPage);
});
//////////////////


router.post(
  "/",
  [
    check("givenName", "Ce champs est obligatoire").not().isEmpty(),
    check("familyName", "Ce champs est obligatoire").not().isEmpty(),
    check("mobile", "Ce champs est obligatoire").not().isEmpty(),
    check("email", "Veuillez entrer une adresse e-mail valide").isEmail(),
  ],
  async (req, res, next) => {
    const { givenName, familyName, email, mobile, state, sourceId, subscribe } =
      req.body;
    returnInputsRequirementErrors(req, res);
    try {
      const isContact = await Contact.findOne({ email });
      if (isContact && sourceId != "catalog" && sourceId != "contact_us") {
        return res.status(400).json({
          errors: [{ msg: "L'adresse e-mail existe déjà!", param: "email" }],
        });
      }
      if (!isContact) {
        const contact = await post(
          Contact,
          {
            givenName,
            familyName,
            email,
            mobile,
            state,
            sourceId,
            subscribe,
          },
          "everestContacts"
        );
        res.json(contact);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
router.route("/:id").get((req, res, next) => {
  findById(Contact, req.params.id, res, next);
});

// router.route("/:id").put((req, res, next) => {
//    update(Contact, req.params.id, req, res, next, "everestContacts");
// });

router.route("/:id").delete((req, res, next) => {
  return remove(Contact, req, res, next, "everestContacts");
});

module.exports = router;