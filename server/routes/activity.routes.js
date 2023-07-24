const express = require("express");
const router = express.Router();
const Axios = require("axios");
const { check, validationResult } = require("express-validator");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const client_token = "everestsportclubbesancon";
const cacheController = require("../controllers/cache.controller");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const config = require("../config/config");

router
  .route("/")
  .post(
    [
      check("name", "Ce champs est obligatoire").not().isEmpty(),
      check("durations", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      returnInputsRequirementErrors(req, res);
      try {
        const { name, durations, colorHex } = req.body;
        const credential = await cacheController.credentialthroughCache();
        await Axios.post(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          {
            name,
            durations,
            colorHex,
          },
          credential
        );
        await cacheController.jsonCache.del("activities_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "activities_key"
        );
        res.send("activity added");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );

router.route("/").get(async (req, res, next) => {
  try {
    var actTab = await cacheController.getThroughCache(
      `${config.config.base_url_resamania}/${client_token}/activities`,
      "activities_key"
    );

    const query = req.query;
    actTab = await actTab.filter((event) => {
      if (
        query.searching &&
        query.searchDateState != "true" &&
        !query.searchMonth
      ) {
        return event.name.toUpperCase().includes(query.searching.toUpperCase());
      }
      if (
        query.searching &&
        query.searchDateState == "true" &&
        !query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z")
        );
      }
      if (
        query.searching &&
        query.searchDateState != "true" &&
        query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState == "true" &&
        query.searchMonth
      ) {
        return (
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z") &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState == "true" &&
        !query.searchMonth
      ) {
        return (
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z")
        );
      }
      if (
        !query.searching &&
        query.searchDateState != "true" &&
        query.searchMonth
      ) {
        return query.searchMonth.includes(
          new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
        );
      }

      if (
        query.searching &&
        query.searchDateState == "true" &&
        query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z") &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState != "true" &&
        !query.searchMonth
      ) {
        return actTab;
      }
    });
    actTab.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    res.send(actTab);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.route("/:id").get(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    const response = await Axios.get(
      `${config.config.base_url_resamania}/${client_token}/activities/${req.params.id}`,
      credential
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.route("/:id").delete(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    await Axios.delete(
      `${config.config.base_url_resamania}/everestsportclubbesancon/activities/${req.params.id}`,
      credential
    );
    await cacheController.jsonCache.del("activities_key");
    await cacheController.getThroughCacheIfNoValueForGivenKey(
      `${config.config.base_url_resamania}/${client_token}/activities`,
      "activities_key"
    );
    res.send("activity deleted");
  } catch (err) {
    res.send(err);
  }
});

router
  .route("/:id")
  .put(
    [
      check("name", "Ce champs est obligatoire").not().isEmpty(),
      check("durations", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();

        const response = await Axios.put(
          `${config.config.base_url_resamania}/everestsportclubbesancon/activities/${req.params.id}`,
          req.body,
          credential
        );
        await cacheController.jsonCache.del("activities_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "activities_key"
        );
        res.send("updated successfully");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );
module.exports = router;