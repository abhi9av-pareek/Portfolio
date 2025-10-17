var express = require("express");
var router = express.Router();

router.get("/portfolio", (req, res) => {
  res.render("index", { title: "Portfolio - My Projects" });
});

// Portfolio Home Page → render index.ejs
router.get("/", (req, res) => {
  res.render("index", { title: "Welcome To Portfolio" });
});

module.exports = router;
