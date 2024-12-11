const express = require("express");
const router = express.Router();
//renders index page
router.get("/", function (req, res, next) {
  res.render("index.ejs");
});
//renders about page
router.get("/about", function (req, res, next) {
  res.render("about.ejs");
});

module.exports = router;
