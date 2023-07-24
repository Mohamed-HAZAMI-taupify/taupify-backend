const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const PopUpSchema = new Schema({
  nbreClick: {
    type: Number,
    require: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = conn.testDB.model("PopUp", PopUpSchema);
