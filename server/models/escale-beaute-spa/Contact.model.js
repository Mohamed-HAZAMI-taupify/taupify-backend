const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const Contact = new Schema({
  number: String,
  address: {
    addressCountry: { type: String, default: "France" },
    addressCountryIso: { type: String, default: "FR" },
    addressLocality: String,
    postalCode: {
      type: String,
    },
    streetAddress: String,
  },
  birthDate: {
    type: Date,
  },
  email: {
    type: String,
  },
  familyName: {
    type: String,
  },
  givenName: {
    type: String,
  },

  undeliverableMail: {
    type: Boolean,
    default: true,
  },
  pictureId: {
    type: String,
  },

  gender: {
    type: String,
  },
  picture: {
    _url: { type: String },
    _delete_url: { type: String },
  },
  clubId: {
    type: String,
  },

  mobile: {
    type: String,
  },
  sourceId: {
    type: String,
  },
  channel: {
    type: String,
    default: "club",
  },
  initialSalepersonId: { type: String },
  currentSalepersonId: { type: String },
  currentSalepersonGivenName: { type: String },
  currentSalepersonFamilyName: { type: String },
  deliverableMail: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
  initialPassword: {
    type: String,
  },
  pictureAllowed: { type: Boolean, default: true },

  state: {
    type: String,
  },
});

module.exports = conn.escaleBeauteSpaDB.model("contact", Contact);
