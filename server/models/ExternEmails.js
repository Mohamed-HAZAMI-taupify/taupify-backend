const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const ExternEmailsSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});
module.exports = conn.testDB.model("extern_emails", ExternEmailsSchema);
