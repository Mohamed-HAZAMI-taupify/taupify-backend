const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
var sgTransport = require("nodemailer-sendgrid-transport");

module.exports = {
  sendLemonOneEmail: (mail) => {
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
        viewPath: path.resolve(__dirname, "../", "../", "views/email-templates"),
        extName: ".handlebars",
      })
    );
    var email = {
      to: mail.el.email,
      from: "LEMON ONE FITNESS <admi.lemononefitness@gmail.com>",
      subject: mail.subject,
      context: mail.context,
      template: mail.templateName,
    };

    mailer.sendMail(email, function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log("Email sent", mail.el.firstname);
    });
  },
};