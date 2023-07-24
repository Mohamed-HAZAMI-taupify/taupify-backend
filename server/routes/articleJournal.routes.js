const express = require("express");
const router = express.Router();
const Article = require("../models/ArticleJournal.model");

router.route("/:id").get(async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res, next) => {
  const {
    cover,
    type,
    title,
    content,
    state,
    priority,
    createdAt,
    createdBy,
    visitor_count,
    updated,
    archived,
  } = req.body;
  try {
    const article = new Article({
      cover,
      type,
      title,
      content,
      state,
      priority,
      createdAt,
      createdBy,
      visitor_count,
      updated,
      archived,
    });
    const savedArticle = await article.save();
    res.send(savedArticle);
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.get("/", async (req, res, next) => {
  try {
    var articles = await Article.find({})
      .sort({ _id: -1 })
      .exec(req.body, (error, articles) => {
        res.send(articles)
      });
    ;
  } catch (err) {
    res.status(500).send();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Article.findByIdAndRemove(req.params.id);
    res.send("article deleted");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

router.route("/:id").put(async (req, res, next) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).send("article updated successfully");
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;
