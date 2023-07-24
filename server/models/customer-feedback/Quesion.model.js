const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const QuestionSchema = new Schema({
  subject: {
    type: String,
  },
  outOf: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
  },
  label: {
    type: String,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "answer",
    },
  ],
});

module.exports = conn.testDB.model("question", QuestionSchema);
