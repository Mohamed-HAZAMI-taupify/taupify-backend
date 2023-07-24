
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
var sgTransport = require("nodemailer-sendgrid-transport");

require("dotenv").config();
module.exports = {
  sendEscaleBeauteSpa: (mail) => {
    var options = {
      auth: {
        api_key: process.env.APIKEY,
      },
    };
    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve(
            __dirname,
            "../",
            "../",
            "views/email-templates"
          ),
          defaultLayout: false,
        },
        viewPath: path.resolve(
          __dirname,
          "../",
          "../",
          "views/email-templates"
        ),
        extName: ".handlebars",
      })
    );
    var email = {
      to: mail.el.email,
      from: "ESCALE BEAUTE & SPA <contact@lescale-beaute-and-spa.fr>",
      subject: mail.subject,
      context: mail.context,
      template: mail.templateName,
    };
    mailer.sendMail(email, function (err) {
      if (err) {
        console.log(err);
      }
      console.log("Email sent", mail.el.firstname);
    });
  },
  };
