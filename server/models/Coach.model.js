
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const CoachListSchema = new Schema({
  givenName: {
    type: String,
    require: true,
  },
  familyName: {
    type: String,
    require: true,
  },
  sportslist: [
    {
      _id: String,
      label: String,
      value: String,
    },
  ],
  image: {
    _url: { type: String, require: true },
    _delete_url:{ type: String, require: true},
  },

  description: {
    type: String,
  },
  calendly: {
    type: String,
  },
  socialmedia: {
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
  },
  cours: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  num: {
    type: Number,
  },
  alternateName: {
    type: String,
  },
  activities: [
    {
      _id: String,
      label: String,
      value: String,
    },
  ],
  id_resamania: {
    type: String,
  },
  id_resamania_prod: {
    type: String,
  },

});
module.exports = conn.testDB.model("CoachList", CoachListSchema);
