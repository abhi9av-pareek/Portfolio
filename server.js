const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/portfolioDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Schema & Model
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// Helpers: optionally send email/SMS without failing the request
async function trySendEmail(payload) {
  const user = process.env.GMAIL_USER || "abhinavrajpurohit900@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD || "mjqf dvxq vtam uevn";
  const to = process.env.CONTACT_TO_EMAIL || user;
  if (!user || !pass || !to) return false;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: user,
      replyTo: payload.email,
      to,
      subject: `Portfolio Contact: ${payload.subject}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage: ${payload.message}`,
    });
    return true;
  } catch (e) {
    console.error("Email send failed:", e.message);
    return false;
  }
}

async function trySendSms(payload) {
  const sid = process.env.TWILIO_ACCOUNT_SID || "";
  const token = process.env.TWILIO_AUTH_TOKEN || "";
  const from = process.env.TWILIO_FROM_NUMBER || "";
  const to = process.env.ALERT_TO_PHONE || "";
  if (!sid || !token || !from || !to) return false;
  try {
    const client = new twilio(sid, token);
    await client.messages.create({
      body: `📩 New Portfolio Contact\nName: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage: ${payload.message}`,
      from,
      to,
    });
    return true;
  } catch (e) {
    console.error("SMS send failed:", e.message);
    return false;
  }
}

// POST /contact route
app.post("/contact", async (req, res) => {
  try {
    // Save only if MongoDB is connected; otherwise skip persist and continue
    if (mongoose.connection.readyState === 1) {
      const newMessage = new Message(req.body);
      await newMessage.save();
    } else {
      console.warn("MongoDB not connected - skipping save for contact message");
    }

    // Fire-and-forget auxiliary notifications
    trySendEmail(req.body);
    trySendSms(req.body);

    res.json({ success: true, message: "Message received ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
