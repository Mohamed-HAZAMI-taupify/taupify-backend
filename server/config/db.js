const mongoose = require("mongoose");
require("dotenv").config();
const db_config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.everestDB = mongoose.createConnection(
  process.env.MONGOURLEVEREST,
  db_config
);

mongoose.testDB = mongoose.createConnection(
  process.env.MONGOURLTEST,
  db_config
);

mongoose.escaleBeauteSpaDB = mongoose.createConnection(
  process.env.MONGOURLESCALESPA,
  db_config
);
mongoose.everfitDB = mongoose.createConnection(
  process.env.MONGOURLEVERFIT,
  db_config
);
mongoose.lemonOneDB = mongoose.createConnection(
  process.env.MONGOURLLEMONONE,
  db_config
);
mongoose.taupifyDB = mongoose.createConnection(
  process.env.MONGOURLTAUPIFY,
  db_config
);
mongoose.k2DB = mongoose.createConnection(process.env.MONGOURLK2, db_config);
module.exports = mongoose;
