const express = require("express");
const router = express.Router();
const url = require("url");
const { post, update } = require("../controllers/rest-api/crud.controller");
const PopUpNbre = require("../models/PopUpClick.model");

router.route("/").post(async (req, res, next) => {
  const { nbreClick } = req.body;
  const popUpNum = await post(
    PopUpNbre,
    {
      nbreClick,
    },
    "popUpnumber"
  );
  res.send(popUpNum);
});
router.route("/:id").put(async (req, res, next) => {
  return update(PopUpNbre,req.params.id, req, res, next, "popUpnumber");
});
router.route("/").get((req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = {};
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
  if (query.searchprospectType) {
    filter.prospectType = query.searchprospectType;
  }
  try {
    skip = Number(req.query.page) * 50;
    PopUpNbre.find(filter, undefined, { skip, limit: 50 })
      .sort({ _id: -1 })
      .exec(req.body, (error, data) => {
        res.json(data);
      });
  } catch (e) {
    res.status(500).send();
  }
});
router.route("/count").get((req, res, next) => {
  PopUpNbre.aggregate(
    [
      {
        $group: {
          _id: null,
          TotalClickPopUp: {
            $sum: "$nbreClick",
          },
        },
      },
    ],
    function (err, data) {
      if (err) {
        return next(err);
      } else {
        const count = data.map((d, index) => {
          return d.TotalClickPopUp;
        });
        res.json(count);
      }
    }
  );
});

module.exports = router;
