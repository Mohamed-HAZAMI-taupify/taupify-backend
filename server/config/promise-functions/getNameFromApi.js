const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

async function getNameFromApi(apiPath) {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return apiResult.data.name;
  } catch (error) {
    console.log(error);
  }
}
module.exports = getNameFromApi;
