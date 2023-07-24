const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const RdvSchema = new Schema({
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  plannedForDate: {
    type: Date,
    require: true,
  },
  plannedForTime: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
  cancelReason: {
    type: String,
    default: "--",
  },
});

module.exports = conn.testDB.model("rdv", RdvSchema);
