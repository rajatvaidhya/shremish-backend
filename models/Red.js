const mongoose = require("mongoose");

const redSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Red = mongoose.model("Red", redSchema);

module.exports = Red;