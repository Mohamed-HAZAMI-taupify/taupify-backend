const metaTagsController = require("../controllers/metaTags.controller");
const express = require("express");
const router = express.Router();
const url = require("url");
const articleJournalModel = require("../models/ArticleJournal.model");


  router.route("/journal").get( (req, res, next) => {
    metaTagsController.metaTag(
      res,
      "Salles de sport | Fitness | Musculation | Cardio | SPA | Piscine",
      "EVEREST sport club, c'est le paradis des amoureux du fitness Atteignez de nouveaux records personnels, vivez des expériences dans nos studios, plongez-vous dans notre piscine, détendez-vous dans notre spa",
      "https://i.ibb.co/9gK4CDn/home-pic-web-mmv1sl.jpg"
    );
  });
  
  router.route("/journal/article/:id/display").get( async(req, res, next) => {
    gotArticle = await articleJournalModel.findById(req.params.id);
    metaTagsController.metaTag(
      res,
      gotArticle.type,
      gotArticle.title,
      gotArticle.cover
    );
  });
  module.exports = router;
