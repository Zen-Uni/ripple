/**
 * @description mongoDB init
 * @author Airbo
 * @since 1.0
 */
require('dotenv').config({ path: '../.env' })
const mongoose = require("mongoose");
const Mongo_URL = process.env.Mongo_URL;
var debug = require("debug")("db:connect");

mongoose.connect(Mongo_URL);

const db = mongoose.connection;
var Schema = mongoose.Schema;

db.on("error", function (error) {
  console.log("connection err:", error);
});
db.once("open", function () {
  debug("db connected");
});

module.exports = { mongoose, db, Schema };
