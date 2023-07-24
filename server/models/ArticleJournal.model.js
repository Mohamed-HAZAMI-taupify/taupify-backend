const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const typeOfElementSchema = new Schema(
  {
    message: String,
  },
  {
    discriminatorKey: "type",
    _id: false,
  }
);

const Article = new Schema({
  cover: {
    type: String,
  },
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  content: [typeOfElementSchema],
  state: {
    type: String,
  },
  isTrend:{
    type: Boolean,
    default:false
  },
  createdAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  visitor_count: {
    type: Number,
  },
  updated: [
    {
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
      message: {
        type: String,
      },
    },
  ],
  archived: [
    {
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
      message: {
        type: String,
      },
    },
  ],
});

Article.path("content").discriminator(
  "image",
  new Schema({
    indexContent: { type: Number, require: true },
    field: {
      type: String,
    },
  })
);
Article.path("content").discriminator(
  "title",
  new Schema({
    indexContent: { type: Number, require: true },
    field: {
      type: String,
    },
  })
);
Article.path("content").discriminator(
  "video",
  new Schema({
    indexContent: { type: Number, require: true },
    field: {
      type: String,
    },
  })
);
Article.path("content").discriminator(
  "",
  new Schema({
    indexContent: { type: Number, require: true },
    field: {
      type: String,
    },
  })
);
Article.path("content").discriminator(
  "description",
  new Schema({
    indexContent: { type: Number, require: true },
    field: {
      type: String,
    },
  })
);

module.exports = conn.testDB.model("articleJournal", Article);