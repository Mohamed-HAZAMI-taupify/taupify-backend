const Axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

const getArticleSubscription = async (apiPath) => {
  try {
    const apiResult = await Axios.get(
      apiPath,
      JSON.parse(localStorage.getItem("credential"))
    );
    return { productName: apiResult.data.productName,
        priceTE: apiResult.data.priceTE,
        priceTI: apiResult.data.priceTI,
        tax: apiResult.data.tax,
        taxRate: apiResult.data.taxRate    
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = getArticleSubscription;
