const express = require("express");
const router = express.Router();
const axios = require("axios");
const { check, validationResult } = require("express-validator");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const client_token = "everestsportclubbesancon";
const cacheController = require("../controllers/cache.controller");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const config = require("../config/config");


//////////////////////////////////////////////////////////////////////////////

async function getAuthToken() {
  const tokenUrl = 'https://api.resamania.com/everestsportclubbesancon/oauth/v2/token';
  const clientId = '60_1fq0ljhjxv40480k4gwc00oc0so804wo88wkc80cg0ok84ksgc';
  const clientSecret = '2f2fqrwmilusk4cgo088ook44ggcw8c4s4o8sg8koww84kwwoc';
  const grantType = 'client_credentials';

  // Create the request body for the token endpoint
  const requestBody = new URLSearchParams();
  requestBody.append('client_id', clientId);
  requestBody.append('client_secret', clientSecret);
  requestBody.append('grant_type', grantType);

  // Make a POST request to the token endpoint to get the access token
  const tokenResponse = await axios.post(tokenUrl, requestBody);
  return tokenResponse.data.access_token;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

// GET route ALLActivity information
router.get('/AllActivity', async (req, res) => {
  try {
    const authToken = await getAuthToken()
    const networkNodeId = '/everestsportclubbesancon/network_nodes/948';
    const apiPath = `${config.config.base_url_resamania}/${client_token}/activities`;
    const credential = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-User-Network-Node-Id': networkNodeId,
      },
    };
    const Activity = await axios.get(apiPath, credential);

    // Extracting hydra:member array from response.data
    const activities = Activity.data['hydra:member'];

    // Using an object to keep track of unique names
    const uniqueNamesMap = {};

    // Mapping the hydra:member array to get the desired format
    const formattedActivities = activities.reduce((accumulator, activity) => {
    const id = activity['@id'];
    const name = activity['name'];

    // Generate a unique key using the name to check uniqueness
    const key = name.toLowerCase(); // Convert the name to lowercase to ignore case sensitivity

    // If the name is not encountered yet, add it to the uniqueNamesMap and push it to the accumulator array
    if (!uniqueNamesMap[key]) {
      uniqueNamesMap[key] = true;
      accumulator.push({
        'id': id,
        'name': name
      });
    }

  return accumulator;
}, []);
    res.status(201).json(formattedActivities);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred coaches' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////


router
  .route("/")
  .post(
    [
      check("name", "Ce champs est obligatoire").not().isEmpty(),
      check("durations", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      returnInputsRequirementErrors(req, res);
      try {
        const { name, durations, colorHex } = req.body;
        const credential = await cacheController.credentialthroughCache();
        await axios.post(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          {
            name,
            durations,
            colorHex,
          },
          credential
        );
        await cacheController.jsonCache.del("activities_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "activities_key"
        );
        res.send("activity added");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );

router.route("/").get(async (req, res, next) => {
  try {
    var actTab = await cacheController.getThroughCache(
      `${config.config.base_url_resamania}/${client_token}/activities`,
      "activities_key"
    );

    const query = req.query;
    actTab = await actTab.filter((event) => {
      if (
        query.searching &&
        query.searchDateState != "true" &&
        !query.searchMonth
      ) {
        return event.name.toUpperCase().includes(query.searching.toUpperCase());
      }
      if (
        query.searching &&
        query.searchDateState == "true" &&
        !query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z")
        );
      }
      if (
        query.searching &&
        query.searchDateState != "true" &&
        query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState == "true" &&
        query.searchMonth
      ) {
        return (
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z") &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState == "true" &&
        !query.searchMonth
      ) {
        return (
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z")
        );
      }
      if (
        !query.searching &&
        query.searchDateState != "true" &&
        query.searchMonth
      ) {
        return query.searchMonth.includes(
          new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
        );
      }

      if (
        query.searching &&
        query.searchDateState == "true" &&
        query.searchMonth
      ) {
        return (
          event.name.toUpperCase().includes(query.searching.toUpperCase()) &&
          new Date(query.searchDate.split("T")[0] + "T" + "00:00:00.000Z") <=
            new Date(event.createdAt) &&
          new Date(event.createdAt) <=
            new Date(query.searchDate.split("T")[0] + "T" + "23:59:59.000Z") &&
          query.searchMonth.includes(
            new Date(event.createdAt).toLocaleDateString("fr", DATE_OPTIONS)
          )
        );
      }
      if (
        !query.searching &&
        query.searchDateState != "true" &&
        !query.searchMonth
      ) {
        return actTab;
      }
    });
    actTab.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    res.send(actTab);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.route("/:id").get(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    const response = await axios.get(
      `${config.config.base_url_resamania}/${client_token}/activities/${req.params.id}`,
      credential
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.route("/:id").delete(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    await axios.delete(
      `${config.config.base_url_resamania}/everestsportclubbesancon/activities/${req.params.id}`,
      credential
    );
    await cacheController.jsonCache.del("activities_key");
    await cacheController.getThroughCacheIfNoValueForGivenKey(
      `${config.config.base_url_resamania}/${client_token}/activities`,
      "activities_key"
    );
    res.send("activity deleted");
  } catch (err) {
    res.send(err);
  }
});

router
  .route("/:id")
  .put(
    [
      check("name", "Ce champs est obligatoire").not().isEmpty(),
      check("durations", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();

        const response = await axios.put(
          `${config.config.base_url_resamania}/everestsportclubbesancon/activities/${req.params.id}`,
          req.body,
          credential
        );
        await cacheController.jsonCache.del("activities_key");
        await cacheController.getThroughCacheIfNoValueForGivenKey(
          `${config.config.base_url_resamania}/${client_token}/activities`,
          "activities_key"
        );
        res.send("updated successfully");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );
module.exports = router;