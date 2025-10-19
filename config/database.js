const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI not found in environment variables");
      return false;
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
      console.log("✅ MongoDB Connected successfully");
      return true;
    } else if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return true;
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return false;
  }
};

module.exports = { connectToMongoDB };
