const express = require("express")
const router = express.Router()



router.get('/watchlist', function(req, res, next){
    res.render('watchlist.ejs')
})

