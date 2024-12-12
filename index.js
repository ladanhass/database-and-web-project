//import required modules
var express = require("express");
var ejs = require("ejs");
var session = require("express-session");
var validator = require("express-validator");
var mysql = require("mysql");
const expressSanitizer = require("express-sanitizer");
require("dotenv").config();
//port and initialise express
const app = express();
const serverPort = 8096;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
// Create a session
app.use(
  session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
//database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "database_app",
  database: "database_coursework",
  password: "myPassword",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected to database");
});
global.db = db;

//defines routes
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

const movieRoutes = require("./routes/movie");
app.use("/movie", movieRoutes);
//starts server
app.listen(serverPort, () =>
  console.log(`Node app listening on port ${serverPort}!`)
);
