const express = require("express");
const router = express.Router();
const PopUp = require("../models/PopUp.model");
const { validationResult } = require("express-validator");
const {
  post,
  findById,
  remove,
  update,
  findThatOne,
} = require("../controllers/rest-api/crud.controller");
const url = require("url");
const filterController = require("../controllers/filter.controller");

router.post("/", async (req, res, next) => {
  const {
    image,
    bodyImage,
    isLogo,
    active,
    state,
    title,
    subtitle,
    description,
    backgroundColor,
    button,
    dateStart,
    dateEnd
  } = req.body;
  const popUp = await post(
    PopUp,
    {
      image,
      bodyImage,
      isLogo,
      active,
      state,
      title,
      subtitle,
      description,
      backgroundColor,
      button,
      dateStart : new Date(dateStart),
      dateEnd : new Date(dateEnd)
    },
    "popUps"
  );
  res.send(popUp);
});
router.get("/", async (req, res, next) => {
  try {
    const query = url.parse(req.url, true).query;
    const filter = filterController.filterBackOfficeList(query);
    const result = await PopUp.aggregate([
      { $match: filter },
      {
        $addFields: {
          placement: {
            $indexOfArray: [["home", "ready", "archived"], "$state"],
          },
        },
      },
      { $sort: { placement: 1 } },
    ]);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/home",async (req, res) => {
  try {
    const currentDate = new Date();
    const activePopUp = await PopUp.findOne({
      dateStart: { $lte: currentDate },
      dateEnd: { $gte: currentDate }
    });

    if (activePopUp) {
      res.status(200).send(activePopUp);
    } else {
     const defaultPopUp = await PopUp.findOne({ state: "home" });
      res.status(200).send(defaultPopUp);
    }
 }catch (err) {
  res.status(500).send(err);
}
});


router.route("/:id").get(async (req, res, next) => {
  return findById(PopUp, req.params.id, res, next);
});

router.delete("/:id", async (req, res) => {
  return remove(PopUp, req.params.id, res, next, "popUps");
});


router.route("/:id").put(async (req, res, next) => {
  //return update(PopUp, req.params.id, req, res, next, "popUps");
  try {
    await PopUp.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).send("Pop-up updated successfully");
  } catch (err) {
    res.status(500).send("server error");
  }
});

// router.route("/:id").put(async (req, res, next) => {
//   return update(PopUp, req.params.id, req, res, next, "popUps");
// });

router.route("/state/:id").put(async (req, res, next) => {
  try {
    const popup = await PopUp.findOneAndUpdate(
      { state: "home" },
      {
        $set: { state: "ready" },
      }
    );
    if (
      popup === null ||
      JSON.stringify(popup._id) !== JSON.stringify(req.params.id)
    ) {
      await PopUp.findByIdAndUpdate(req.params.id, {
        $set: { state: "home" },
      });
    }

    res.status(200).send("Pop-up updated successfully");
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;