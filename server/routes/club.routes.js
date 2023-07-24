const express = require("express");
const router = express.Router();
const Axios = require("axios");
const client_token = "everestsportclubbesancon";
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const cacheController = require("../controllers/cache.controller");
const config = require("../config/config");

router.route("/").get(async (req, res, next) => {
  try {
    const response = await cacheController.getThroughCache(
      `${config.config.base_url_resamania}/${client_token}/clubs`,
      "clubs_key"
    );
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

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
