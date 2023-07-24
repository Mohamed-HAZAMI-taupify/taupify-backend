const express = require("express");
const router = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
const Redis = require("ioredis");
const JSONCache = require("redis-json");
const redis = localStorage.getItem("header")
  ? new Redis({ host: "redis" })
  : new Redis(process.env.REDIS_TLS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
    });
const jsonCache = new JSONCache(redis, { prefix: "cache:" });

router.route("/").get(async (req, res, next) => {
  try {
    await jsonCache.clearAll();
    res.send("CACHE CLEARED");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
