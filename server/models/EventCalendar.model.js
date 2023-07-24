const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const EventCalendar = new Schema({
  title: {
    _id: String,
    label: String,
    value: String,
  },
  duration: {
    _id: String,
    label: String,
    value: String,
  },
  backgroundColor: {
    type: String,
    require: true,
  },
  hieght: {
    type: String,
    require: true,
  },
});

module.exports = conn.testDB.model("EventCalendar", EventCalendar);
