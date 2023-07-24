const mongoose = require ("mongoose") ; 
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const k2Contact = new Schema({
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
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  subscribe: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
  },
  picture: {
    _url: { type: String },
    _delete_url: { type: String },
  },
  tags: [String],
  clubId: {
    type: String,
  },
  landline: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  sourceId: {
    type: String,
  },
  prescriberId: { type: String },
  occupationId: { type: String },
  goalId: { type: String },
  goalIds: [String],
  motivationId: { type: String },
  companyId: { type: String },
  identificationValidated: { type: Boolean, default: true },
  parentalDischargeDate: {
    type: Date,
    default: Date.now,
  },
  parentalDischargeClubId: { type: String },
  parentalIdentificationValidated: { type: Boolean, default: true },
  initialSalepersonId: { type: String },
  currentSalepersonId: { type: String },
  currentSalepersonGivenName: { type: String },
  currentSalepersonFamilyName: { type: String },
  externalId: { type: String },
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
  locale: { type: String },
  pictureAllowed: { type: Boolean, default: true },

  state: {
    type: String,
  },
});

module.exports = conn.k2DB.model("contact" , k2Contact);