const express = require("express");
const router = express.Router();
const url = require("url");
const EventCalendar = require("../models/EventCalendar.model");
const { check, validationResult } = require("express-validator");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const { post } = require("../controllers/rest-api/crud.controller");
router.post(
  "/",
  [
    check("title", "Ce champs est obligatoire").not().isEmpty(),
    check("duration", "Ce champs est obligatoire").not().isEmpty(),
    check("backgroundColor", "Ce champs est obligatoire").not().isEmpty(),
  ],
  async (req, res, next) => {
    const { title, duration, backgroundColor, hieght } = req.body;
    returnInputsRequirementErrors(req, res);
    const eventCalendar = await post(
      EventCalendar,
      {
        title,
        duration,
        backgroundColor,
        hieght,
      },
      "eventcalendars"
    );
    res.send(eventCalendar);
  }
);
router.route("/").get((req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = {};
  if (req.query.searching) {
    const searching = new RegExp(req.query.searching, "i");
    filter.$or = [
      { firstname: searching },
      { lastname: searching },
      { email: searching },
    ];
  }
  if (req.query.searchMonth) {
    filter.$expr = {
      $eq: [{ $month: "$date" }, parseInt(req.query.searchMonth)],
    };
  }
  if (req.query.searchDateState == "true") {
    filter.date = {
      $gte: req.query.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
      $lt: req.query.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
    };
  }
  try {
    skip = Number(req.query.page) * 50;
    EventCalendar.find(filter, undefined, { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
