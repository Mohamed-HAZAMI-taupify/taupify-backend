const express = require("express");
const router = express.Router();
const url = require("url");
const { check, validationResult } = require("express-validator");
const Coach = require("../models/Coach.model");
const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const cacheController = require("../controllers/cache.controller");
const {
  getAll,
  getFiltered,
  findById,
} = require("../controllers/rest-api/crud.controller");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const config = require("../config/config");

// GET route coaches information
router.get('/AllCoaches', async (req, res) => {
  try {
    // Retrieve all coaches from the database
    const coaches = await Coach.find();

    // Return the coaches as a response
    res.json(coaches);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: 'An error occurred coaches' });
  }
});

router.route("/coach-activity").get(async (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const coachFilter = {};
  if (query.searchActivity) {
    const searchActivity = new RegExp(query.searchActivity, "i");
    coachFilter.$or = [
      { activities: { $elemMatch: { label: searchActivity } } },
    ];
  }
  return getFiltered(req,Coach, "coaches", coachFilter, 3600);
});

router
  .route("/")
  .post(
    [
      check("givenName", "Ce champs est obligatoire").not().isEmpty(),
      check("familyName", "Ce champs est obligatoire").not().isEmpty(),
      check("description", "Ce champs est obligatoire").not().isEmpty(),
      check("activities", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();
        const coach = new Coach(req.body);
        await Axios.post(
          `${config.config.base_url_resamania}/everestsportclubbesancon/coaches`,
          {
            givenName: coach.givenName,
            familyName: coach.familyName,
            alternateName: coach.alternateName,
            activities: coach.activities.map((t) => t.value),
          },
          credential
        ).then((response) => {
          Coach.create({
            givenName: coach.givenName,
            familyName: coach.familyName,
            alternateName: coach.alternateName,
            activities: coach.activities,
            image: {
              _url: coach.image._url,
              _delete_url: coach.image._delete_url,
            },
            description: coach.description,
            calendly: coach.calendly,
            socialmedia: coach.socialmedia,
            email: coach.email,
            phone: coach.phone,
            date: coach.date,
            id_resamania: response.data["@id"],
            id_resamania_prod: response.data["@id"],
            num: coach.num,
          });
        });
        await cacheController.jsonCache.del("coaches");
        await getAll(Coach, "coaches", 3600);
        res.send("coach added");
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );

router.route("/").get(async (req, res, next) => {
  const coaches = await getAll(Coach, "coaches_key", 3600);
  res.send(coaches);
});

router.route("/get-image").get(async (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const filter = {};
  if (query.searching) {
    const searching = new RegExp(query.searching, "i");
    filter.$or = [{ id_resamania_prod: searching }];
  }
  await Coach.find({ filter })
    .sort({ date: 1 })
    .limit(100)
    .exec(req.body, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
});
router
  .route("/:id")
  .put(
    [
      check("givenName", "Ce champs est obligatoire").not().isEmpty(),
      check("familyName", "Ce champs est obligatoire").not().isEmpty(),
      check("description", "Ce champs est obligatoire").not().isEmpty(),
      check("activities", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      const credential = await cacheController.credentialthroughCache();
      returnInputsRequirementErrors(req, res);
      try {
        await Coach.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        }).then((response) => {
          Axios.put(
            `${config.config.base_url_resamania}${response.id_resamania_prod}`,
            {
              givenName: req.body.givenName,
              familyName: req.body.familyName,
              alternateName: req.body.alternateName,
              activities: req.body.activities.map((t) => t.value),
            },
            credential
          );
        });
        await cacheController.jsonCache.del("coaches");
        await getAll(Coach, "coaches");
        res.send("coach updated");
      } catch (err) {
        res.status(500).send("server error");
      }
    }
  );
router.route("/:id").delete(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();
    let coach = await Coach.findById(req.params.id);
    await Coach.findByIdAndRemove(req.params.id);
    await Axios.delete(
      `${config.config.base_url_resamania}${coach.id_resamania_prod}`,
      credential
    );
    await cacheController.jsonCache.del("coaches_key");
    await getAll(Coach, "coaches_key");
    res.status(200).send("coach deleted");
  } catch (error) {
    res.status(500).send("server error");
  }
});


module.exports = router;
