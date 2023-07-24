const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

const execApi = async (apiPath) => {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return apiResult.data["hydra:member"];
  } catch (error) {
    console.log(error);
  }
};

module.exports = execApi;
