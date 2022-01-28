/**
 * @description Cache Schema
 * @author Airbo
 * @since 1.0
 */

var { mongoose, Schema } = require("./index");

var cacheSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  captcha: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    index: { expires: 300 },
  },
});

module.exports = mongoose.model("Cache", cacheSchema);
