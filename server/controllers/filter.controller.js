module.exports = {
  filterContactList: (query) => {
    const filter = {};

    if (query.searching) {
      const searching = new RegExp(query.searching, "i");
      filter.$or = [
        { givenName: searching },
        { familyName: searching },
        { email: searching },
      ];
    }
    if (query.searchMonth) {
      filter.$expr = {
        $eq: [{ $month: "$createdAt" }, parseInt(query.searchMonth)],
      };
    }
    if (query.searchDateState === "true") {
      filter.createdAt = {
        $gte: query.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
        $lt: query.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
      };
    }
    if (query.state) {
      filter.$expr = { state: query.state };
    }
    if (query.sourceId) {
      query.sourceId.includes(filter.sourceId.map((k) => k));
    }
  },

  filterBackOfficeList: (query) => {
    const filter = {};
try {
    if (query.searching) {
      const searching = new RegExp(query.searching, "i");
      filter.$or = [
        { givenName: searching },
        { familyName: searching },
        { email: searching },
        { title: searching },
      ];
    }
    if (query.searchMonth) {
      filter.$expr = {
        $eq: [{ $month: "$date" }, parseInt(query.searchMonth)],
        $eq: [{ $month: "$createdAt" }, parseInt(query.searchMonth)],
      };
    }
    if (query.searchDateState === "true") {
      filter.createdAt = {
      $gte: new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z"),
      $lt: new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z"),
      };
    }
    return filter;
   } catch (err) {
      res.status(500).send(err);
    }
  },
};
