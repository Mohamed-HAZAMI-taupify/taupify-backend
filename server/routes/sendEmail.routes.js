const express = require("express");
const router = express.Router();
const EmailController = require("../controllers/Email.controller");
const sendEverfitEmail = require("../controllers/sendEverfitEmail");
const ExternEmails = require("../models/ExternEmails");
const sendLemonOne = require("../controllers/sendLemonOne");
const sendEscaleSpaEmail = require("../controllers/sendEscaleSpaEmail.controller");
const sendK2 = require("../controllers/sendK2Email");

router.route("/send").post((req, res, next) => {
  let subject = req.body.objet;
  let template = req.body.selectedThemeName;
 
  ExternEmails.find({}).exec(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      data.map((el) => {
        let templateName = template;
        let context = {
          firstName: el.firstname,
          _id: el._id,
        };
        EmailController.sendEverestEmail({
          el,
          subject,
          templateName,
          context,
        });
        res.end();
      });
    }
  });
  console.log("succefully sent");
});
router.route("/everfit-pre-test").post(async (req, res, next) => {
  const el = req.body;
  const subject = "PRÉ-TEST BPJEPS AF";
  const templateName = "everfit-pre-test";
  const context = {
    _id: req.body._id,
    firstName: req.body.firstname,
    email: req.body.email,
    message: req.body.message,
  };
  try {
    await sendEverfitEmail.sendEverfitEmail({
      el,
      subject,
      templateName,
      context,
    });
    res.end("message sended");
  } catch (err) {
    res.status(500).send("server error");
  }
});
router
  .route("/send-pre-registration-confirmation")
  .post(async (req, res, next) => {
    let el = req.body;
    let subject = "Confirmation de votre demande";
    let templateName = "confirmation-mail";
    let context = {
      _id: el._id,
      givenName: el.givenName,
    };
    try {
      EmailController.sendEverestEmail({
        el,
        subject,
        templateName,
        context,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });
router.route("/send-confirmation-everfit").post(async (req, res, next) => {
  const el = req.body;
  const subject = "Confirmation de votre demande";
  const templateName = "everfit-confirmation-mail";
  let context = {
    _id: req.body._id,
    firstName: req.body.firstname,
  };
  try {
     sendEverfitEmail.sendEverfitEmail({
      el,
      subject,
      templateName,
      context,
    });
    res.end();
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.route("/confirmation-rdv-mail").post(async (req, res, next) => {
  let el = req.body;
  let subject = "Confirmation de votre RDV avec EVEREST";
  let templateName = "confirmation-mail-rdv";
  let context = {
    lastname: el.lastname,
    firstname: el.firstname,
    email: el.email,
    plannedForDate: el.plannedForDate,
    plannedForTime: el.plannedForTime,
  };
   EmailController.sendRdvEmail({ el, subject, templateName, context });
  res.end();
});
router.route("/cancelation-rdv-mail").post(async (req, res, next) => {
  let el = req.body;
  let subject = "Annulation de votre RDV avec EVEREST";
  let templateName = "annulation-mail-rdv";
  let context = {
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    plannedForDate: req.body.plannedForDate,
    plannedForTime: req.body.plannedForTime,
  };
  try {
     EmailController.sendRdvEmail({ el, subject, templateName, context });
    res.end();
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.route("/send-response-contact-us").post(async (req, res, next) => {
  let el = req.body;
  let subject = "Réponse contactez-nous";
  let templateName = "reponse-mail-contact-us";
  let context = {
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    message: req.body.message,
  };
  try {
     EmailController.sendEverestEmail({
      el,
      subject,
      templateName,
      context,
    });
    res.end();
  } catch (err) {
    res.status(500).send("server error");
  }
});

router
  .route("/send-pre-registration-confirmation-lemon-one")
  .post(async (req, res, next) => {
    let el = req.body;
    let subject = "Confirmation de votre demande";
    let templateName = "lemon-one-mail-comfirmation";
    let context = {
      firstName: el.firstname,
    };
    try {
       sendLemonOne.sendLemonOneEmail({
        el,
        subject,
        templateName,
        context,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });

router
  .route("/send-confirmation-everest-become-coach")
  .post(async (req, res, next) => {
    let el = req.body;
    let subject = "Confirmation de votre demande";
    let templateName = "everest-confirmation-mail-become-coach";

    let context = {
      _id: el._id,
      firstName: el.firstname,
    };
    try {
       EmailController.sendEverestEmail({
        el,
        subject,
        templateName,
        context,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });

router
  .route("/send-confirmation-lemon-one-become-coach")
  .post(async (req, res, next) => {
    const el = req.body;
    const subject = "Confirmation de votre demande";
    const templateName = "lemon-one-confirmation-mail-become-coach";
    let context = {
      _id: req.body._id,
      firstName: req.body.firstname,
    };
    try {
       sendLemonOne.sendLemonOneEmail({
        el,
        subject,
        templateName,
        context,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });

  router
  .route("/send-confirmation-k2-become-coach")
  .post(async (req, res, next) => {
    const el = req.body;
    const subject = "Confirmation de votre demande";
    const templateName = "k2-confirmation-email-devenir-coach";
    let context = {
      _id: req.body._id,
      firstName: req.body.firstname,
    };
    try {
      sendK2.sendK2Email({
        el,
        subject,
        templateName,
        context,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });

router
  .route("/send-pre-registration-confirmation-escale-beaute-spa")
  .post(async (req, res, next) => {
    let el = req.body;
    let subject="NOËL MAGIQUE";
    let templateName="escale-spa";

    try {
       sendEscaleSpaEmail.sendEscaleBeauteSpa({
        el,
        subject,
        templateName,
      });
      res.end();
    } catch (err) {
      res.status(500).send("server error");
    }
  });

  router.route("/send-offre-escale-beaute-spa").post((req, res, next) => {
    // let subject = req.body.objet;
    // let template = req.body.selectedThemeName;
    let subject="NOËL MAGIQUE";
    let template="escale-spa";
   
    ExternEmails.find({}).exec(req.body, (error, data) => {
      if (error) {
        return next(error);
      } else {
        data.map((el) => {
          let templateName = template;
          let context = {
            firstName: el.firstname,
            _id: el._id,
          };
          sendEscaleSpaEmail.sendEscaleBeauteSpa({
            el,
            subject,
            templateName,
            context,
          });
          res.end();
        });
      }
    });
    console.log("succefully sent");
  });

module.exports = router;
