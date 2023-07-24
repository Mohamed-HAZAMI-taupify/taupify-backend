const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

async function getActivityNameAndDuration(apiPath) {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return { duration: apiResult.data.durations[0], name: apiResult.data.name };
  } catch (error) {
    console.log(error);
  }
}

module.exports = getActivityNameAndDuration;
