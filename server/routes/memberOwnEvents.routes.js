const express = require("express");
const router = express.Router();
const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const cacheController = require("../controllers/cache.controller");
const config = require("../config/config");

router.route("/").post(async (req, res, next) => {


  try {
    // var monobjet_json = await localStorage.getItem("MemberData");
    // var monobjet = await JSON.parse(monobjet_json);
    const { contactNumber, classEvent , targetId } = req.body;

    const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
      `${config.config.base_url_resamania}${targetId}`,
      'contact_user'
    );

    const credential = await cacheController.credentialthroughCache();

    // {
    //   contactId: monobjet.contactId,
    //   contactGivenName: monobjet.givenName,
    //   contactFamilyName: monobjet.familyName,
    //   contactNumber,
    //   contactCreatedAt: monobjet.createdAt,
    //   classEvent,
    // },

    await Axios.post(
      `${config.config.base_url_resamania}/everestsportclubbesancon/attendees`,
      {
        contactId: contact_user.contactId,
        contactGivenName: contact_user.givenName,
        contactFamilyName: contact_user.familyName,
        contactNumber,
        contactCreatedAt: contact_user.createdAt,
        classEvent,
      },
      credential
    );
    await cacheController.jsonCache.del("memberOwnEvent");
    await cacheController.jsonCache.del("events_key");
    const keys = await cacheController.redis.keys("*bookedmemberOwnEvent*");
    keys.length > 0 ? await cacheController.redis.del(keys) : console.log("");
    res.send("Reservation added");
  } catch (err) {
    console.log("error", err);
    res.send(`${err.response.data["hydra:description"]}`);
  }
});

router.route("/").get(async (req, res, next) => {
  try {
    // var monobjet_json = await localStorage.getItem("MemberData");
    // var monobjet = await JSON.parse(monobjet_json);

    const targetId  = req.query.param
    const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
      `${config.config.base_url_resamania}${targetId}`,
      'contact_user'
    );

    const credential = await cacheController.credentialthroughCache();
    const events = await Axios.get(
      `${config.config.base_url_resamania}/everestsportclubbesancon/attendees?contactId=${contact_user.contactId}&page=${req.query.page}&state=${req.query.state}`,
      credential
    );
    res.send(events.data);
  } catch (err) {
    res.send(err.message);
  }
});

router.route("/:id").post(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();
    await Axios.post(
      `${config.config.base_url_resamania}/everestsportclubbesancon/attendees/${req.params.id}/transitions`,
      {
        transition: "cancel",
      },
      credential
    );
    await cacheController.jsonCache.del("memberOwnEvent");
    await cacheController.jsonCache.del("events_key");
    const keys = await cacheController.redis.keys("*memberOwnEvent*");
    keys.length > 0 ? await cacheController.redis.del(keys) : console.log("");
    res.send("event canceled");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.route("/:id").get(async (req, res, next) => {
  var tab = [];
  try {
    const credential = await cacheController.credentialthroughCache();
    const events = await Axios.get(
      `${config.config.base_url_resamania}/everestsportclubbesancon/class_events/${req.params.id}`,
      credential
    );
    var memberOwnEventsById = await events.data;
    tab.push(memberOwnEventsById);
    res.send(tab);
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = router;
