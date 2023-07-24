const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn = require("../config/db");

const SurveySchema = new Schema ({
    doesAgree : {
        type : String,
    },
    
    IdContact : {
        type: Schema.Types.ObjectId,
        ref: "Contact"
    }
}) ;
module.exports = conn.everestDB.model("emailSurvey",SurveySchema)