const express = require("express");
const router = express.Router();
const axios = require("axios");
const client_token = "everestsportclubbesancon";
const config = require("../config/config");
const timeController = require("../controllers/time.controller");


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
var today = new Date();
// GET route ALLActivity information
router.get('/AllEventPlaning', async (req, res) => {
  try {
    const authToken = await getAuthToken()
    const networkNodeId = '/everestsportclubbesancon/network_nodes/948';
    const apiPath =`${config.config.base_url_resamania}/${client_token}/events?startedAt=${timeController.timeController(today)}`;
    const credential = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-User-Network-Node-Id': networkNodeId,
      },
    };
    const Clubs = await axios.get(apiPath, credential);

    // Extracting hydra:member array from response.data
    const AllEventPlaning = Clubs.data['hydra:member'];

    res.status(201).json(AllEventPlaning);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred EventPlaning' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;