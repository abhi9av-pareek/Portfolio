const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log("Email Configuration Test:");
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log(
  "GMAIL_APP_PASSWORD:",
  process.env.GMAIL_APP_PASSWORD ? "Set" : "Not set"
);
console.log("CONTACT_TO_EMAIL:", process.env.CONTACT_TO_EMAIL);

// Test email service
require("./utils/emailService")
  .sendEmail({
    name: "Test User",
    email: "test@example.com",
    subject: "Test Subject",
    message: "This is a test message",
  })
  .then((result) => {
    console.log("Email result:", result);
  })
  .catch((error) => {
    console.error("Email error:", error);
  });
