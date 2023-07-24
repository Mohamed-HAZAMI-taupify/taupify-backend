const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Axios = require("axios");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const client_token = "everestsportclubbesancon";
const config = require("../config/config");
const cacheController = require("../controllers/cache.controller");

router
  .route("/")
  .post(
    [check("email", "Veuillez entrer une adresse email valide!").isEmail()],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();
        const { email } = req.body;
        const response = await Axios.post(
          `${config.config.base_url_resamania}/${client_token}/password_requests`,
          {
            email,
            loginRedirectUrl: "https://www.everest-sportclub.fr/",
          },
          credential
        );
        res.send("added");
      } catch (err) {
        res.send(err.response.data["hydra:description"]);
      }
    }
  );



module.exports = router;


