const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

async function getCoachEverest(apiPath) {
  try {
    const apiResult = await Axios.get(apiPath);
    const coach = apiResult.data[0].name;
    return coach;
  } catch (err) {
    console.log(err);
  }
}

async function getNameAndIdOfTheCoach(apiPath) {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );

    const coach = {
      id: apiResult.data["@id"],
      name: apiResult.data.givenName,
    };
    return coach;
  } catch (error) {
    console.log(error);
  }
}

module.exports = getNameAndIdOfTheCoach;
