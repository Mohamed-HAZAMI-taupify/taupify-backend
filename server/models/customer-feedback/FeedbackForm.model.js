const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const FeedbackformSchema = new Schema({
  submitDate: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "answer",
    },
  ],
  message: {
    type: String,
  },
});

module.exports = conn.testDB.model("feedbackform", FeedbackformSchema);
