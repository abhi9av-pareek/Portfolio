const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log("Password Analysis:");
console.log("Current MONGO_URI:", process.env.MONGO_URI);

// Parse the URI
const uri = process.env.MONGO_URI;
if (uri) {
  const url = new URL(uri);
  console.log("\n Connection Details:");
  console.log("Username:", url.username);
  console.log("Password (raw):", url.password);
  console.log("Password (decoded):", decodeURIComponent(url.password));

  console.log("\n Try these password variations:");
  console.log("1. Original:", "<Abhinavpareek11>");
  console.log("2. Without brackets:", "Abhinavpareek11");
  console.log("3. URL encoded:", encodeURIComponent("<Abhinavpareek11>"));

  console.log("\n To fix, update your .env file with one of these:");
  console.log(
    "MONGO_URI=mongodb+srv://abhi9av_pareek_db_user:Abhinavpareek11@cluster0.vbgpzvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("OR");
  console.log(
    "MONGO_URI=mongodb+srv://abhi9av_pareek_db_user:%3CAbhinavpareek11%3E@cluster0.vbgpzvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
}
