const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const specific_states = [
  "prospect",
  "client",
  "old_client",
  "lost_client",
  "banned_client",
  "fake_client",
  "prospect",
];
const specific_states_client = [
  "client",
  "old_client",
  "banned_client",
];

const email_states = [
  "exten_emails",
  "client",
  "old_client",
  "lost_client",
  "banned_client",
  "fake_client",
  "prospect",
];

const specific_source = ["rendez_vous", "pop_up", "contact_us", "admin", "catalog", "join_us"];

const Contact = new Schema({
  number: String,
  address: {
    addressCountry: { type: String, default: "France" },
    addressCountryIso: { type: String, default: "FR" },
    addressLocality: String,
    postalCode: {
      type: String,
      // required: [
      //   function () {
      //     return specific_states_client.includes(this.state);
      //   },
      // ],
    },
    streetAddress: String,
  },
  birthDate: {
    type: Date,
    required: [
      function () {
        return specific_states_client.includes(this.state);
      },
      "please enter your birthDate",
    ],
  },
  email: {
    type: String,
    required: [
      function () {
        return email_states.includes(this.state);
      },
      "please enter your email",
    ],
  },
  familyName: {
    type: String,
    required: [
      function () {
        return specific_states.includes(this.state);
      },
      "please enter your family name",
    ],
  },
  givenName: {
    type: String,
    required: [
      function () {
        return specific_states.includes(this.state);
      },
      "please enter your given name",
    ],
  },
  subscribe: {
    type: Boolean,
    default: true,
  },

  gender: {
    type: String,
    required: [
      function () {
        return specific_states_client.includes(this.state);
      },
      "please enter your gender",
    ],
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
    required: [
      function () {
        return specific_states.includes(this.state);
      },
      "please enter your mobile number",
    ],
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
    required: [
      function () {
        return specific_states_client.includes(this.state);
      },
      "please enter your password",
    ],
  },
  locale: { type: String },
  pictureAllowed: { type: Boolean, default: true },

  state: {
    type: String,
    required: [
      true,
      "don't forget the client state (prospect, client, old_client, lost_client, banned_client)",
    ],
  },
});
module.exports = conn.everestDB.model("Contact", Contact);
