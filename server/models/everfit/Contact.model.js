const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const EverfitContact = new Schema({
  number: String,
  address: {
    addressCountry: { type: String, default: "France" },
    addressCountryIso: { type: String, default: "FR" },
    addressLocality: String,
    // postalCode: {
    //   type: String,
    // },
    streetAddress: String,
  },
  birthDate: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  BPJEPSAF: {
    type: String,
  },

  familyName: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
 
  gender: {
    type: String,
  },
  picture: {
    _url: { type: String },
    _delete_url: { type: String },
  },
  state: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updated: [
    {
      at: Date,
      by: String,
    },
  ],
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
  pictureAllowed: { type: Boolean, default: true },
  deliverableMail: { type: Boolean, default: true },
  source: { type: String },
  // training: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Training",
  //   required: true,
  // },
  motivation: { type: String },
});
module.exports = conn.everfitDB.model("contact", EverfitContact);
