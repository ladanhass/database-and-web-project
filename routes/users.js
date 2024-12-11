// imports
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10; // defines salt rounds
const { check, validationResult } = require("express-validator");
//middleware to redirect users to login page
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.render("./login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};
// render registration page
router.get("/register", function (req, res, next) {
  res.render("register.ejs", { alert: [] });
});
//renders login page
router.get("/login", function (req, res, next) {
  res.render("login.ejs", { alert: [] });
});
//handles registraion
router.post(
  "/registered",
  [
    //validates user inputs
    check("email").isEmail().withMessage("provide a valid email"),
    check("plainPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be atleat 8 characters long")
      .isAlphanumeric()
      .withMessage("password must only contain only numbers and letters"),
    check("first").notEmpty().withMessage("First name cannot be empty"),
    check("last").notEmpty().withMessage("last name cannot be empty"),
    check("username")
      .isLength({ min: 5 })
      .withMessage("username must be atleate 5 characters long"),
  ],
  //checks if error in validation
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("./register", { alert: errors.array() });
    }
    //sanitizes and extracts user inputs
    const plainPassword = req.body.plainPassword;
    const username = req.sanitize(req.body.username);
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);

    //hashes users password before saving to database
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedpassword) {
      if (err) {
        return next(err);
      }

      //inserts new users data into database
      let sqlquery =
        "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES(?,?,?,?,?)";
      let newrecord = [username, firstName, lastName, email, hashedpassword];

      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          return next(err);
        }
        //redirects to login if successfull
        return res.redirect("login");
      });
    });
  }
);
//login handles authentication
router.post("/loggedin", function (req, res, next) {
  console.log(req.body);
  const plainPassword = req.body.plainPassword;
  const username = req.sanitize(req.body.username);
  const email = req.sanitize(req.body.email);
  // finds user by email
  let sqlquery = "SELECT * FROM users WHERE email = ?";
  db.query(sqlquery, [email], (err, result) => {
    if (err) {
      return next(err);
    }
    // checks if email exists
    if (result.length === 0) {
      return res.render("login", {
        alert: [{ msg: "Email not found please register !" }],
      });
    }
    //checks id username matches to associated email
    if (result[0].username !== username) {
      return res.render("login", {
        alert: [{ msg: "Username does not match email" }],
      });
    }

    const hashedPassword = result[0].hashedPassword;
    //compares hashed password to plain password
    bcrypt.compare(plainPassword, hashedPassword, function (err, isMatch) {
      if (err) {
        return next(err);
      }
      if (isMatch) {
        req.session.userId = req.body.username;
        //redirects to watchlist page
        return res.render("watchlist");
      } else {
        return res.render("login", {
          alert: [{ msg: "login failed incorrect password" }],
        });
      }
    });
  });
});
//logout route to destroy session
router.post("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.redirect("./login");
  });
});

module.exports = router;
