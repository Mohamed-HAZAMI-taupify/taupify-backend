const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const Contact = new Schema({
  givenName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = conn.taupifyDB.model("contact", Contact);
