const config = require("../config");
const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

const getNameAndIdFromApi = async (apiPath) => {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return { id: apiResult.data["@id"], name: apiResult.data.name };
  } catch (error) {
    console.log(error);
  }
};

module.exports = getNameAndIdFromApi;
