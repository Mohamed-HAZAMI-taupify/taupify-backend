const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const AnswerSchema = new Schema({
  rate: {
    type: Number,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "question",
    require: true,
  },
  feedbackform: {
    type: Schema.Types.ObjectId,
    ref: "feedbackform"
  },
});

module.exports = conn.testDB.model("answer", AnswerSchema);
