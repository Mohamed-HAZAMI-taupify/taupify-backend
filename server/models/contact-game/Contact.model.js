const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const ContactGame = new Schema({
  familyName: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = conn.everestDB.model ("contactGame",ContactGame )
