const mongoose = require('mongoose');

async function connectToMongo() {
  try {
    await mongoose.connect("mongodb+srv://vrinxsystem:rajat-123@cluster0.zkbwolf.mongodb.net/shremish", {
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
