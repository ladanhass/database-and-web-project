const express = require("express");
const router = express.Router();

//renders search page
router.get("/search", function (req, res, next) {
  res.render("search.ejs");
});
//handles search sql
//allows users to search movie name from database
router.get("/search_result", function (req, res, next) {
  let sqlquery =
    "SELECT * FROM movie WHERE name LIKE '%" + req.query.search_text + "%'";
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.error(err);
      next(err);
    }
    console.log("query:", result);
    // renders list page passing query and displays result
    res.render("list.ejs", { availableMovies: result });
  });
});
// list all movies in database
router.get("/list", function (req, res, next) {
  let sqlquery = "SELECT * FROM movie";
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    //renders list page and displays results
    res.render("list.ejs", { availableMovies: result });
  });
});
module.exports = router;
