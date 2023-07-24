const { cache, jsonCache } = require("../../cache.controller");
const cacheController = require("../../cache.controller");

module.exports = {
  updateMasterWhenPostingSlave: async (Master, slave, slavers, id, cacheKey) => {
    try {
      const master = await Master.findById(id);
      await master[slavers].push(slave);
      await cacheController.jsonCache.del(cacheKey);
      master.save();
    } catch (err) {
      return err.message;
    }
  },
  getMastersWithTheirSlaves: async (
    res,
    masterModel,
    slavesAsTheyAreWrittenInTheSchema,
    cacheKey,
    expireDuration,
    filter,
    fieldsToShow
  ) => {
    try {
      const fromCache = await cache(cacheKey);
      if (!fromCache) {
        const list = await masterModel
          .find(filter)
          .populate(slavesAsTheyAreWrittenInTheSchema, fieldsToShow)
          .lean();
        const listStingified = JSON.stringify(list);
        const listParsed =await JSON.parse(listStingified);

        console.log(cacheKey, "FROM DATA BASE");
        await jsonCache.set(
          cacheKey,
          listParsed,
          expireDuration && {
            expire: expireDuration,
          }
        );
        res.send(list);
      } else {
        console.log(cacheKey, " FROM CACHE");
        res.send(fromCache);
      }
    } catch (err) {
      res.send(err);
    }
  },
};
