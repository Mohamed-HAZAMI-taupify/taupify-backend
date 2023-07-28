const express = require("express");
const router = express.Router();
const axios = require("axios");
const client_token = "everestsportclubbesancon";
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const cacheController = require("../controllers/cache.controller");
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
router.get('/AllClubs', async (req, res) => {
  try {
    const authToken = await getAuthToken()
    const networkNodeId = '/everestsportclubbesancon/network_nodes/948';
    const apiPath = `${config.config.base_url_resamania}/${client_token}/clubs`;
    const credential = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-User-Network-Node-Id': networkNodeId,
      },
    };
    const Clubs = await axios.get(apiPath, credential);

    // Extracting hydra:member array from response.data
    const AllClubs = Clubs.data['hydra:member'];

    // Using an object to keep track of unique names
    const uniqueNamesMap = {};

    // Mapping the hydra:member array to get the desired format
    const formattedClubs = AllClubs.reduce((accumulator, _studios) => {
    const id = _studios['@id'];
    const name = _studios['name'];

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
    res.status(201).json(formattedClubs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred Clubs' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////


router.route("/").get(async (req, res, next) => {
  try {
    const response = await cacheController.getThroughCache(
      `${config.config.base_url_resamania}/${client_token}/clubs`,
      "clubs_key"
    );
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

router.route("/:id").get(async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();

    const response = await axios.get(
      `${config.config.base_url_resamania}${req.params.id}`,
      credential
    );
    res.send(response.data["hydra:member"]);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
