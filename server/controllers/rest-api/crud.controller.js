const cacheController = require("../cache.controller");
const { jsonCache } = require("../cache.controller");

const cache = async (key) => {
  const myCache = await jsonCache.get(key);
  return !myCache ? false : myCache;
};
module.exports = {
  post: async (Model, bodyReq, keyCache) => {
    try {
      const instance = new Model(bodyReq);
      await instance.save();
      await cacheController.jsonCache.del(keyCache);
      return instance;
    } catch (err) {
      return err.message;
    }
  },
  getAll: async (model, cacheKey, expireDuration) => {
    try {
      const fromCache = await cache(cacheKey);
      if (fromCache === false) {
        const list = await model.find();
        console.log(cacheKey, "FROM DATA BASE");
        await jsonCache.set(
          cacheKey,
          JSON.parse(JSON.stringify(list)),
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
  getFiltered: async (model, cacheKey, filter, expireDuration) => {
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
  findById: async (Model, req, res, next) => {
    Model.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
  },
  update: (Model, req, res, next, keyCache) => {
    Model.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
      async (error, data) => {
        if (error) {
          return next(error);
        } else {
          await cacheController.jsonCache.del(keyCache);
          res.json(data);
        }
      }
    );
  },
  remove: (Model, req, res, next, keyCache) => {
    Model.findByIdAndRemove(
     
      req.params.id,
      async (error, data) => {
        if (error) {
          return next(error);
        } else {
          await cacheController.jsonCache.del(keyCache);
          res.status(200).json({
            msg: data,
          });
        }
      }
    );
  },
  findThatOne: async (Model, filter, res) => {
    try {
      const element = await Model.findOne(filter);
      filter ? res.json(element) : null;
    } catch (err) {
      res.status(500).send();
    }
  },

  getData: async (model, res, req) => {
    try {
      const element = await model.find({}).sort({ _id: -1 });
      res.json(element);
    } catch (err) {
      res.status(500).send();
    }
  },
};
