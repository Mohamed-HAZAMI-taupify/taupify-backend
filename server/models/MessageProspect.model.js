const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../config/db");

const ContactUsProspectSchema = new Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
  email: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  message: [
    {
      type: String,
      require: true,
    },
  ],
  replied: {
    type: Boolean,
    default: false,
  },
  response: {
    type: String,
    default: "",
  },
});

module.exports = conn.everestDB.model(
  "ContactUsProspect",
  ContactUsProspectSchema
);
