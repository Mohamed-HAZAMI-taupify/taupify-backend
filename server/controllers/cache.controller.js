const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const Redis = require("ioredis");
const JSONCache = require("redis-json");
const config = require("../config/config");

const redis = localStorage.getItem("header")
  ? new Redis({ host: "redis" })
  : new Redis(process.env.REDIS_TLS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
    });
const jsonCache = new JSONCache(redis, { prefix: "cache:" });

const cache = async (key) => {
  const myCache = await jsonCache.get(key);
  return !myCache ? false : myCache;
};
module.exports = {
  cache,
  redis,
  jsonCache,
  credentialthroughCache: async () => {
    try {
      const fromCache = await cache("credentialkey");
      console.log("credentialthroughCache");
      if (!fromCache) {
        const credential = await Axios.get(
          config.config.base_url_resamania + "/" +
            config.config.client_token +
            "/oauth/v2/token?client_id=" +
            process.env.ACCESSID +
            "&client_secret=" +
            process.env.ACCESSSECRET +
            "&grant_type=client_credentials",
          console.log("typeClientCridentielle")
        );
        const credentialJson = JSON.stringify({
          headers: {
            Accept: "application/ld+json",
            "Content-Type": "application/ld+json",
            Authorization: "bearer " + credential.data.access_token,
            "X-User-Club-Id": "/everestsportclubbesancon/clubs/1100",
            "X-User-Network-Node-Id":
              "/everestsportclubbesancon/network_nodes/948",
          },
        });
        
        jsonCache
          .set(
            "credentialkey",
            JSON.parse(credentialJson),
            { expire: 3600 },
            console.log("added to cache")
          )
          .catch((err) => {
            console.log(err);
          });
        console.log("typeClientJson", credentialJson)
        return JSON.parse(credentialJson);
       
      }
      if (fromCache) {
        console.log("credentialkey", " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },
  events: async (apiPath, cacheKey) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {

        const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        await list.data["hydra:member"].map((e) => {
          e.id = e["@id"];
          e._type = e["@type"];
        });
        console.log(cacheKey, "FROM APIs RESAMANIA");
        await jsonCache.set(cacheKey, list.data["hydra:member"], {
          expire: 604800,
        });
        return list.data["hydra:member"];
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },

  memberOwnEvents: async (apiPath, cacheKey) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        await list.data["hydra:member"].map((e) => {
          e.id = e["@id"];
          e._type = e["@type"];
        });
        console.log(cacheKey, "FROM APIs RESAMANIA");

        // await jsonCache.set(cacheKey, list.data, {
        //   expire: 1800,
        // });
        return list.data;
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getElementByIdFromCacheList: async (keyOfTheList, elementId) => {
    try {
      const myCache = await jsonCache.get(keyOfTheList);
      return myCache ? myCache.find((e) => e["@id"] === elementId) : null;
    } catch (error) {
      console.log(error);
    }
  },
  getThroughCache: async (apiPath, cacheKey, expireDuration) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        console.log(cacheKey, "FROM APIs RESAMANIA");
        await jsonCache.set(
          cacheKey,
          list.data["hydra:member"],
          expireDuration && {
            expire: expireDuration,
          }
        );
        return list.data["hydra:member"];
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },
  getFilteredFromDb: async (model, cacheKey, filter, expireDuration) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const list = await model.findOne(filter);
        console.log(cacheKey, "FROM DATA BASE");
        await jsonCache.set(
          cacheKey,
          list,

          expireDuration && {
            expire: expireDuration,
          }
        );
        return list;
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getThroughCacheWithoutHydraMember: async (
    apiPath,
    cacheKey,
    expireDuration
  ) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        //console.log(cacheKey, "FROM API RESAMANIA");
        // await jsonCache.set(
        //   cacheKey,
        //   list.data,
        //   expireDuration && {
        //     expire: expireDuration,
        //   }
        // );
        return list.data;
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },
  getContactToken: async (
    apiPath,
    cacheKey,
    expireDuration
  ) => {
    try {
         const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        console.log(cacheKey, "FROM API RESAMANIA");
        return list.data;
      
    } catch (error) {
      console.log(error);
    }
  },

  getThroughCacheIfNoValueForGivenKey: async (
    apiPath,
    cacheKey,
    expireDuration
  ) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const credential = await module.exports.credentialthroughCache();
        const list = await Axios.get(apiPath, credential);
        console.log(cacheKey, "FROM APIs RESAMANIA");
        await jsonCache.set(
          cacheKey,
          list.data["hydra:member"],
          expireDuration && {
            expire: expireDuration,
          }
        );
        return list.data["hydra:member"];
      } else {
        console.log(cacheKey, " FROM CACHE");
        return fromCache;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
