const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../../config/db");

const TrainingSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
  everfitContacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "contact",
    },
  ],
});

module.exports = conn.everfitDB.model("Training", TrainingSchema);
