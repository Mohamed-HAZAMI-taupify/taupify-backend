const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
async function getDurationFromApi(apiPath) {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return apiResult.data.durations[0];
  } catch (error) {
    console.log(error);
  }
}
module.exports = getDurationFromApi;
