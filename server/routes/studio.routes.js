const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Axios = require("axios");
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
      check("club", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      returnInputsRequirementErrors(req, res);
      try {
        const {
          name,
          club,
          streetAddress,
          postalCode,
          addressLocality,
          addressCountry,
        } = req.body;
        const credential = await cacheController.credentialthroughCache();
        await Axios.post(
          `${config.config.base_url_resamania}/${client_token}/studios`,
          {
            name,
            club,
            streetAddress,
            postalCode,
            addressLocality,
            addressCountry,
          },
          credential
        );
        await cacheController.jsonCache.del("studios_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "studios_key"
        );

        res.send("added");
      } catch (err) {
        res.send(err);
      }
    }
  );

router.route("/").get(async (req, res, next) => {
  try {
    var studioTab = await cacheController.getThroughCache(
      `${config.config.base_url_resamania}/${client_token}/studios`,
      "studios_key"
    );
    const DATE_OPTIONS = {
      month: "numeric",
    };
    const query = req.query;
    studioTab = await studioTab.filter((event) => {
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
          event.name.includes(query.searching) &&
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
        return studioTab;
      }
    });
    await studioTab.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.send(studioTab);
  } catch (err) {
    res.send(err);
    console.error(err);
  }
});

router.route("/:id").delete(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();
    await Axios.delete(
      `${config.config.base_url_resamania}/everestsportclubbesancon/studios/${req.params.id}`,
      credential
    );
    await cacheController.jsonCache.del("studios_key");
    await cacheController.getThroughCacheIfNoValueForGivenKey(
      `${config.config.base_url_resamania}/${client_token}/activities`,
      "studios_key"
    );

    res.send("studio deleted");
  } catch (err) {
    res.send(err);
  }
});

router
  .route("/:id")
  .put(
    [
      check("name", "Ce champs est obligatoire").not().isEmpty(),
      check("club", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const {
          name,
          streetAddress,
          postalCode,
          addressLocality,
          addressCountry,
        } = req.body;
        const credential = await cacheController.credentialthroughCache();
        await Axios.put(
          `${config.config.base_url_resamania}/everestsportclubbesancon/studios/${req.params.id}`,
          {
            name,
            streetAddress,
            postalCode,
            addressLocality,
            addressCountry,
          },
          credential
        );
        await cacheController.jsonCache.del("studios_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "studios_key"
        );

        res.send("updated successfully");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );
router.route("/:id").get(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();
    const response = await Axios.get(
      `${config.config.base_url_resamania}${req.params.id}`,
      credential
    );
    res.send(response.data["hydra:member"]);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
