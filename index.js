var express = require('express')
var ejs = require('ejs')

var mysql = require('mysql')

const app = express()
const port = 8000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

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

app.locals.moviesData = {moviesName:"Watchlist"}

const mainRoutes = require("./routes/main")
app.use('/' , mainRoutes)

// add route handles for origanal pages here

app.listen(port, () => console.log('Node app listening on port ${port}!'))