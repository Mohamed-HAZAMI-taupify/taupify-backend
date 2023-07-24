const express = require("express");
const router = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const client_token = "everestsportclubbesancon";
const execApi = require("../config/promise-functions/execApi");
const config = require("../config/config");
const cacheController = require("../controllers/cache.controller");

router.route("/").get(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    const articles = await execApi(
      `${config.config.base_url_resamania}/${client_token}/articles`,
       credential
    );
    res.send(articles);
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
