const express = require("express");
const router = express.Router();
const url = require("url");
const Rdv = require("../models/Rdv.model");
const { check, validationResult } = require("express-validator");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");

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
      plannedForDate,
      plannedForTime,
    } = req.body;
    returnInputsRequirementErrors(req, res);
    try {
      let rdv = new Rdv({
        firstname,
        lastname,
        email,
        phone,
        plannedForDate,
        plannedForTime,
      });
      await rdv.save();
      res.json(rdv);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);
router.route("/").get((req, res, next) => {
  Rdv.find({})
    .sort({ _id: -1 })
    .exec(req.body, (err, rdvList) => {
      if (err) {
        res.json({
          error: err,
        });
      }
      res.json({
        rdvListSorted: rdvList,
      });
    });
});
router.route("/filtered").get((req, res, next) => {
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
      $eq: [{ $month: "$createdAt" }, parseInt(query.searchMonth)],
    };
  }
  if (query.searchDateState == "true") {
    filter.createdAt = {
      $gte: query.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
      $lt: query.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
    };
  }
  query.switched === "true"
    ? (filter.isCanceled = true)
    : (filter.isCanceled = false);
  try {
    skip = Number(req.query.page) * 50;
    Rdv.find(filter, undefined, { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
router.route("/canceled-rdv").get((req, res, next) => {
  try {
    Rdv.find({ isCanceled: true })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
router.route("/active-rdv").get((req, res, next) => {
  try {
    Rdv.find({ isCanceled: false })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
router.route("/:id").delete((req, res, next) => {
  Rdv.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});
router.route("/:id").put((req, res, next) => {
  Rdv.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

module.exports = router;
