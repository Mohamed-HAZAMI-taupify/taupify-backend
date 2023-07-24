const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const PopUpModel = new Schema({
  image: {
    _url: { type: String },
    _delete_url: { type: String },
  },
  isLogo: {
    type: Boolean,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  button: {
    _link: { type: String },
    _content: { type: String },
    _color: { type: String },
    _backgroundColor: { type: String },
  },
  state : {
    type: String,
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
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
    },
  ],
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
});
module.exports = conn.everestDB.model("PopUpModel", PopUpModel)
  