const mongoose = require('mongoose');
require("dotenv").config();

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectToMongo;
