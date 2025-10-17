var express = require("express");
var router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.render("index", { title: "Welcome To Portfolio" });
});

module.exports = router;
