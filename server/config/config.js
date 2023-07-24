const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
module.exports.config = {
  access_token: localStorage.getItem("credential"),
  client_token: "everestsportclubbesancon",
  base_url_resamania: "https://api.resamania.com",
  adminConfig: {
    headers: {
      Accept: "application/ld+json",
      "Content-Type": "application/ld+json",
      Authorization: "bearer " + localStorage.getItem("credential"),
      "X-User-Club-Id": "/everestsportclubbesancon/clubs/1100",
      "X-User-Network-Node-Id": "/everestsportclubbesancon/network_nodes/948",
    },
  },
  memberConfig: {
    headers: {
      Accept: "application/ld+json",
      "Content-Type": "application/ld+json",
      Authorization: "bearer " + localStorage.getItem("credential"),
      "X-User-Club-Id": "/everestsportclubbesancon/clubs/1100",
      "X-User-Network-Node-Id": "/everestsportclubbesancon/network_nodes/948",
    },
  },
  stripeConfig: () => {
    return {
      Accept: "application/ld+json",
      "Content-Type": "application/ld+json",
      Authorization: "bearer " + process.env.STRIPEKEY,
    };
  },
};