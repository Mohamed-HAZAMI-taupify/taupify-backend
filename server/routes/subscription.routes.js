const express = require("express");
const router = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const client_token = "everestsportclubbesancon";
const cacheController = require("../controllers/cache.controller");
const execApi = require("../config/promise-functions/execApi");

router.route("/").get(async (req, res, next) => {
  try {
    // var monobjet_json =  localStorage.getItem("MemberData");
    // var monobjet = await JSON.parse(monobjet_json);
    
    const targetId  = req.query.param
    const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
      `${config.config.base_url_resamania}${targetId}`,
      'contact_user'
    );

    const subscriptions = await execApi(
      `${config.config.base_url_resamania}/${client_token}/subscriptions?contact=${contact_user.contactId}`,
      "subscriptions"
    );

    res.send(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.send(error);
  }
});

module.exports = router;
