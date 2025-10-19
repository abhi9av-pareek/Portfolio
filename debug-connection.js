const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

async function debugConnection() {
  console.log("🔍 Debugging MongoDB connection...");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set");

  // Parse the URI to show what we're connecting to
  const uri = process.env.MONGO_URI;
  if (uri) {
    const url = new URL(uri);
    console.log("Host:", url.hostname);
    console.log("Database:", url.pathname.substring(1) || "default");
    console.log("Username:", url.username);
    console.log(
      "Password:",
      url.password ? "***" + url.password.slice(-3) : "Not set"
    );
  }

  try {
    console.log("\n🔄 Attempting connection...");

    // Remove deprecated options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected successfully!");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);

    // Test a simple operation
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.name === "MongoServerError") {
      console.error("\n💡 Possible solutions:");
      console.error("1. Check if username/password are correct");
      console.error("2. Verify database user has proper permissions");
      console.error("3. Check if IP address is whitelisted in MongoDB Atlas");
      console.error("4. Ensure the database user exists in MongoDB Atlas");
    }

    process.exit(1);
  }
}

debugConnection();
