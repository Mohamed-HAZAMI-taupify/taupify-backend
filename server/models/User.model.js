const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../config/db");


const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: [String],
  default: [],
});

module.exports = conn.testDB.model("user", UserSchema);
