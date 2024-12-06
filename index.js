var express = require('express')
var ejs = require('ejs')
var session = require ('express-session');
var validator = require ('express-validator');
var mysql = require('mysql')
const expressSanitizer = require('express-sanitizer');

const app = express()
const port = 8045

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(expressSanitizer());
// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))
const db = mysql.createConnection ({
    host: 'localhost',
    user:'root' ,
    database: 'database_coursework',
    password: 'root1234'

})
db.connect((err)=> {
    if(err){
        throw err
    }
    console.log('connected to database')
})
global.db = db

//app.locals.moviesData = {moviesName:"Watchlist"}//

const mainRoutes = require("./routes/main")
app.use('/' , mainRoutes)
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)


// add route handles for origanal pages here


//app.get('/watchlist', redirectLogin, function (req, res) {
   // res.render('watchlist');
//});



app.listen(port, () => console.log(`Node app listening on port ${port}!`))