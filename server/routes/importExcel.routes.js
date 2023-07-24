const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const express = require("express");
const router = express.Router();
const path = require("path");
router.route("/import-excel").get((req, res, next) => {
  const csvPath = path.resolve(__dirname, "../", "config/extern.csv");
  csvtojson()
    .fromFile(csvPath)
    .then((csvData) => {
      mongodb.connect(
        process.env.MONGOURLTEST,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) throw err;
          client
            .db("test")
            .collection("extern_emails")
            .insertMany(csvData, (err, res) => {
              if (err) throw err;
              console.log(`Inserted: ${res.insertedCount} rows`);
              client.close();
            });
        }
      );
      res.send("added");
    });
});
module.exports = router;
