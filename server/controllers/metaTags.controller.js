const path = require("path");
const fs = require("fs");

module.exports = {
  metaTag: ( res, type, title, cover) => {
    const filePath = path.join(__dirname, "../../client/build", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      data = data.replace(/\$OG_TITLE/g, type);
      data = data.replace(/\$OG_DESCRIPTION/g, title);
      result = data.replace(/\$OG_IMAGE/g, cover);
      return res.send(result);
    });
  },
};
