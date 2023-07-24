const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const axios = require("axios");
const jwt_decode = require("jwt-decode");
const config = require("../config/config");


const permittedRole = (permissions) => {
  return async (req, res, next) => {
    const decoded = await jwt_decode(localStorage.getItem("member"));

    const response = await axios.get(
      `${config.config.base_url_resamania}/everestsportclubbesancon/contact_users/${decoded.userId}`,
      JSON.parse(localStorage.getItem("credential"))
    );

    let includeRole = false;
    response.data.roles.map((role) => (includeRole = permissions.includes(role)));
    includeRole ? next() : res.status(401).json("You don't have permission");
  };
};

module.exports = { permittedRole };
