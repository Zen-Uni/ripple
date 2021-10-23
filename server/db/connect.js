const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/ripple");

module.exports = mongoose;