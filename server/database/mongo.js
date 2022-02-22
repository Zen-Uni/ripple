const Mongoose = require("mongoose");
const connection = async () => {
  await Mongoose.connect("mongodb://127.0.0.1:27017/ripple");
  return "POND";
};

const Schema = Mongoose.Schema;

module.exports = { Mongoose, connection, Schema };
