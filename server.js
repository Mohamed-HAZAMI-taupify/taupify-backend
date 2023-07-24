var compression = require("compression");
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(compression());
// const payementRoute = require("./server/routes/payement.route");
const metaTagsController = require("./server/controllers/metaTags.controller");
const CoachRoute = require("./server/routes/coach.routes");
const rdvRoute = require("./server/routes/rdv.routes");
const AuthRoute = require("./server/routes/auth.routes");
const memberOwnEventsRoutes = require("./server/routes/memberOwnEvents.routes");
const subscriptionRoute = require("./server/routes/subscription.routes");
const sendEmail = require("./server/routes/sendEmail.routes");
const importExcelRoute = require("./server/routes/importExcel.routes");
const eventCalendarRoute = require("./server/routes/eventCalendar.routes");
const everfitContactRoute = require("./server/routes/everfit/contact.routes");
const lemonContactRoute = require("./server/routes/lemon-one/contact.routes");
const TaupifyContactRoute = require("./server/routes/taupify/contact.routes");
const activityRoute = require("./server/routes/activity.routes");
const studioRoute = require("./server/routes/studio.routes");
const clubRoute = require("./server/routes/club.routes");
const resetPasswordRoute = require("./server/routes/resetPassword.routes");
const articlesRoute = require("./server/routes/article.routes");
const deleteCacheRoute = require("./server/routes/deleteCache.routes");
const popUpNbresRoute = require("./server/routes/popUpClick.routes");
const contactEspacleSpaRoute = require("./server/routes/escale-beaute-spa/contact.routes");
const contactGameRoute = require("./server/routes/contact-game/contcat.routes");
const contactFormulaireEverestRoute = require("./server/routes/formulaire-everest/contact.routes");
const contactFormulaireEverfitRoute = require("./server/routes/formulaire-everfit/contact.routes");
const answerRoute = require("./server/routes/customer-feedback/answer.routes");
const questionRoute = require("./server/routes/customer-feedback/question.routes");
const feedbackFormRoute = require("./server/routes/customer-feedback/feedbackForm.routes");
const trainingRoute = require("./server/routes/everfit/training.routes");
const k2ContactRoute = require("./server/routes/k2/k2.routes");
const SondageEmailRoute = require ("./server/routes/sondageEmail.routes");
const contactFormulaireOpenDay = require("./server/routes/formulaire-open-day/contact.routes");
const contactUsprospectRoute = require("./server/routes/messageProspect.routes");
const contactRoute = require("./server/routes/contact.routes");
const metaTagsRoute = require("./server/routes/metaTags.routes");
const contactEverestRoute = require("./server/routes/contact-everest.routes");
const articleJournalRoute = require("./server/routes/articleJournal.routes");
const popUpRoute = require("./server/routes/popUp.routes");
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./server/graphQL/typeDefs");
const resolvers = require("./server/graphQL/resolvers");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 4000;
async function startServer() {
  try {
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app });
    // apolloServer.applyMiddleware({ app: app , path: "/everest-gql"}); en cas de test sur qraphql server and comment the previous line
  } catch (err) {
    console.log(err.message);
  }
}
// app.use("/create-payment-intent", payementRoute);
app.use("/rdv", rdvRoute);
app.use("/email", sendEmail);
app.use("/trainers", CoachRoute);
app.use("/oauth", AuthRoute);
app.use("/subscriptions", subscriptionRoute);
app.use("/member-own-events", memberOwnEventsRoutes);
app.use("/import-excel", importExcelRoute);
app.use("/event-calendar", eventCalendarRoute);
app.use("/everfit-contact", everfitContactRoute);
app.use("/lemon-one-contact", lemonContactRoute);
app.use("/taupify-contact", TaupifyContactRoute);
app.use("/activity", activityRoute);
app.use("/studio", studioRoute);
app.use("/club", clubRoute);
app.use("/reset-password", resetPasswordRoute);
app.use("/articles", articlesRoute);
app.use("/delete-cache", deleteCacheRoute);
app.use("/pop-up", popUpNbresRoute);
app.use("/article-journal", articleJournalRoute);
app.use("/escale-spa/contact", contactEspacleSpaRoute);
app.use("/answer", answerRoute);
app.use("/question", questionRoute);
app.use("/feedback-form", feedbackFormRoute);
app.use("/training", trainingRoute);
app.use("/contact-k2", k2ContactRoute);
app.use("/sondage-email", SondageEmailRoute);
app.use("/contact-us-prospect", contactUsprospectRoute);
app.use("/contact", contactRoute);
app.use("/tm", metaTagsRoute);
app.use("/contact-everest", contactEverestRoute);
app.use("/popup", popUpRoute);
app.use("/contact-game" , contactGameRoute)
app.use("/contact-formulaire-everest",contactFormulaireEverestRoute)
app.use("/contact-formulaire-everfit",contactFormulaireEverfitRoute)
app.enable("trust proxy");
app.get("*", (req, res, next) => {
  try {
    req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
  } catch (err) {
    res.send(err);
  }
});
app.get("/", (req, res) => {
  metaTagsController.metaTag(
    res,
    "Salles de sport | Fitness | Musculation | Cardio | SPA | Piscine",
    "EVEREST sport club, c'est le paradis des amoureux du fitness Atteignez de nouveaux records personnels, vivez des expériences dans nos studios, plongez-vous dans notre piscine, détendez-vous dans notre spa",
    "https://i.ibb.co/tB1DPzS/coaching-personnel.png"
  );
});
//--------connect to heroku
if (process.env.NODE_ENV) {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    } catch (err) {
      res.send(err);
      fs.readFile("./views/index.html");
    }
  });
}

app.listen(port, () => {
  try {
    startServer();

    console.log(`Server is up on port ${port}!`);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = app;