const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const Contact = new Schema({
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
  certificate: {
    type: String,

    
  },
  BPJEPSAF: {
    type: String,
    
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = conn.everestDB.model ("contactFormulaireEverfit",Contact )
