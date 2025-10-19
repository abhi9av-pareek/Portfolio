const dotenv = require("dotenv");
const { connectToMongoDB } = require("./config/database");

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log("🔍 Testing MongoDB connection...");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set");

  try {
    const connected = await connectToMongoDB();
    if (connected) {
      console.log("✅ MongoDB connection test successful!");
      process.exit(0);
    } else {
      console.log("❌ MongoDB connection test failed!");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Connection test error:", error.message);
    process.exit(1);
  }
}

testConnection();
