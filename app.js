var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var twilio = require("twilio");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const portfolioRoutes = require("./routes/portfolioRoutes");

dotenv.config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/portfolio", portfolioRoutes);
app.use(express.static("public"));
app.use(bodyParser.json());

// --- Contact API (same-origin) ---
// Connect to Mongo only once for this app (optional)
try {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolioDB";
  if (mongoose.connection.readyState === 0) {
    mongoose
      .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDB Connected (app.js)"))
      .catch((err) => console.error("Mongo error:", err.message));
  }
} catch (e) {
  console.warn("Skipping Mongo connect:", e.message);
}

const Message =
  mongoose.models.Message ||
  mongoose.model(
    "Message",
    new mongoose.Schema({
      name: String,
      email: String,
      subject: String,
      message: String,
      date: { type: Date, default: Date.now },
    })
  );

async function trySendEmail(payload) {
  const user = process.env.GMAIL_USER || "abhinavrajpurohit900@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD || "mjqf dvxq vtam uevn";
  const to =
    process.env.CONTACT_TO_EMAIL || "abhinavrajpurohit900@gmail.com" || user;
  if (!user || !pass || !to) return false;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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
  const to = process.env.ALERT_TO_PHONE || "+918946925061";
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

app.post("/contact", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const doc = new Message(req.body);
      await doc.save();
    } else {
      console.warn("Mongo not connected - skipping save (app.js)");
    }
    trySendEmail(req.body);
    trySendSms(req.body);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// Chatbot API route removed (OpenAI integration deleted)
module.exports = app;
