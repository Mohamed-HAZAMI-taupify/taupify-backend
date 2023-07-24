const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const Axios = require("axios");
const cacheController = require("../controllers/cache.controller");
const {
  returnInputsRequirementErrors,
} = require("../controllers/inputs.controller");
const config = require("../config/config");

router.get("/", async (req, res, next) => {
  try {
    const credential = await cacheController.credentialthroughCache();
    const response = await Axios.get(
      `${config.config.base_url_resamania}/everestsportclubbesancon/contacts`,
      credential
    );
    res.send(response.data);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router
  .route("/:id")
  .put(
    [
      check("givenName", "Ce champs est obligatoire").not().isEmpty(),
      check("familyName", "Ce champs est obligatoire").not().isEmpty(),
      check("mobile", "Entrez un mobile valide (+33 xxx xxx xxx)").isLength({ min: 12, max:12 }),
    ],
    async (req, res) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();
        const response = await Axios.put(
          `${config.config.base_url_resamania}/everestsportclubbesancon/contacts/${req.params.id}`, 
          req.body,
          credential
        );
        cacheController.jsonCache.del("contact_resamania");
        res.send("updated successfully");
      } catch (err) {
        res.send(`${err.response.data["hydra:description"]}`);
      }
    }
  );
router
  .route("/:id/change-password")
  .put(
    [
      check("password", "Ce champs est obligatoire").not().isEmpty(),
      check("newPassword", "Ce champs est obligatoire").not().isEmpty(),
    ],
    async (req, res, next) => {
      returnInputsRequirementErrors(req, res);
      try {
        const credential = await cacheController.credentialthroughCache();
        await Axios.put(
          config.config.base_url_resamania +
          "/everestsportclubbesancon/contact_users/" +
            req.params.id +
            "/change_password",
          { old: req.body.password, new: req.body.newPassword },
          credential
        );
        res.send("updated successfully");
      } catch (error) {
        res.send(error.message);
      }
    }
  );
module.exports = router;
