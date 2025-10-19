const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const portfolioRoutes = require("./routes/portfolioRoutes");

// Import controllers and config
const { handleContactForm } = require("./controllers/contactController");
const { connectToMongoDB } = require("./config/database");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

// Initialize MongoDB connection
connectToMongoDB();

// Contact form route
app.post("/contact", handleContactForm);

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
