const express = require("express")
const router = express.Router()

router.get('/search', function(req, res, next){
    res.render("search.ejs")
})



router.get('/search_result', function(req,res, next){
    let sqlquery = "SELECT * FROM movie WHERE name LIKE '%" + req.query.search_text + "%'"
    db.query(sqlquery, (err, result) =>{
        if(err){
            console.error(err);
            next(err)
        }
        console.log("query:", result);
        res.render("list.ejs", {availableMovies:result})
    })
})

router.get('/list', function(req,res,next){
    let sqlquery = "SELECT * FROM movie"
    db.query(sqlquery,(err,result)=>{
        if(err){
            next(err)
        }
        res.render("list.ejs", {availableMovies:result})
    })
})

module.exports = router;