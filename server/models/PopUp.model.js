const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conn= require("../config/db");

const PopUpModelView = new Schema({
  image: {
    _url: { 
      type: String,
      default: ""
     },
    _delete_url: { 
      type: String,
      default: ""
     },
  },
  bodyImage: {
    _url: { 
      type: String,
      default: ""
     },
    _delete_url: { 
      type: String,
      default: ""
     },
  },
  isLogo: {
    type: Boolean,
  },
  title :{
    title : { 
      type: String,
      default: ""
     },
    titleColor : { 
      type: String,
      default: ""
    },
    titleFontSize : { 
      type: String ,
      default: ""
     },
    titleFontWeight : { 
      type: String ,
      default: ""
     },
     titleFontFamily : { 
      type: String ,
      default: ""
     },
     titleFontStyle : { 
      type: String ,
      default: ""
     },
     titletextDecorationLine : {
      type: String ,
      default: ""
     },
     titleTextAlign : {
      type: String ,
      default: "start"
     },
     titleBackgroundColor : {
      type: String ,
      default: ""
     },
     titleLineHeight : {
      type: String ,
      default: ""
     },
     titleWidth : {
      type: String ,
      default: ""
     }
  },
  subtitle : {
    subtitle : { 
      type: String,
      default: ""
     },
    SubtitleColor : { 
      type: String,
      default: ""
     },
    SubtitleFontSize : { 
      type: String,
      default: ""
     },
    SubtitleFontWeight : { 
      type: String,
      default: ""
    },
    SubtitleFontFamily : { 
      type: String ,
      default: ""
     },
     SubtitleFontStyle : { 
      type: String ,
      default: ""
     },
     SubtitleTextDecorationLine : {
      type: String ,
      default: ""
     },
     SubtitleTextAlign : {
      type: String ,
      default: "start"
     },
     SubtitleBackgroundColor : {
      type: String ,
      default: ""
     },
     SubtitleLineHeight : {
      type: String ,
      default: ""
     },
     SubtitleWidth : {
      type: String ,
      default: ""
     }
  },
  description : {
    description : { 
      type: String,
      default: ""
     },
    descriptionColor : { 
      type: String,
      default: ""
     },
    descriptionFontSize : { 
      type: String,
      default: ""
     },
    descriptionFontWeight : { 
      type: String,
      default: ""
     },
     descriptionFontFamily : { 
      type: String ,
      default: ""
     },
     descriptionFontStyle : { 
      type: String ,
      default: ""
     },
     descriptionTextDecorationLine : {
      type: String ,
      default: ""
     },
     descriptionTextAlign : {
      type: String ,
      default: "start"
     },
     descriptionBackgroundColor : {
      type: String ,
      default: ""
     },
     descriptionLineHeight : {
      type: String ,
      default: ""
     },
     descriptionWidth : {
      type: String ,
      default: ""
     }
  },
  backgroundColor: {
    hex : { type: String },
    rgb : { 
      r : { type: Number },
      g : { type: Number },
      b : { type: Number },
    },
    hsv : { 
      h : { type: Number },
      s : { type: Number },
      v : { type: Number },
     },
    descriptionFontWeight : { type: String }
  },
  active: {
    type: Boolean,
  },
  button: {
    _link: { type: String },
    _content: { type: String },
    _color: { type: String },
    _backgroundColor: { type: String },
  },
  dateStart: {
    type: Date ,
    default: Date.now
   },
  dateEnd: {
    type: Date ,
    default: Date.now
   },
  state : {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updated: [
    {
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
    },
  ],
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
});
module.exports = conn.everestDB.model("PopUpModelView", PopUpModelView)
  