const Message = require("../models/Message");
const { sendEmail } = require("../utils/emailService");
const { sendSMS } = require("../utils/smsService");
const { connectToMongoDB } = require("../config/database");
const mongoose = require("mongoose");

const handleContactForm = async (req, res) => {
  try {
    // Try to save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const doc = new Message(req.body);
      await doc.save();
      console.log("Message saved to MongoDB");
    } else {
      console.warn("MongoDB not connected - skipping database save");
      // Try to reconnect
      await connectToMongoDB();
    }

    // Send notifications (fire and forget)
    sendEmail(req.body);
    sendSMS(req.body);

    res.json({
      success: true,
      message: "Message received successfully",
      saved: mongoose.connection.readyState === 1,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

module.exports = { handleContactForm };
