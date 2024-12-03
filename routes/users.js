const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10 // defines salt rounds



router.get("/register" , function (req, res, next){
    res.render('register.ejs')
})
router.get("/login" , function (req, res, next){
    res.render('login.ejs')
})


router.post('/registered', function (req, res, next){
    const plainPassword = req.body.plainPassword;
    const username = req.body.username;
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
  

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedpassword){
        //stores hashed password
        if(err){
            return next(err);
        }
     
     //saves data in database
     let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES(?,?,?,?,?)";
     let newrecord = [username, firstName, lastName, email, hashedpassword];

     db.query(sqlquery, newrecord, (err, result) =>{
        if(err){
            return next(err);
        }
        let resultMessage = 'Hello' + req.body.first + '' + req.body.last + 'you are now registered ' + req.body.email;
        res.send(resultMessage);
     });
});
});
router.post('/loggedin', function (req, res, next){
    console.log(req.body);
    const plainPassword = req.body.plainPassword;
    const username = req.body.username;

let sqlquery = 'SELECT * FROM users WHERE username = ?';
db.query(sqlquery, [username], (err, result) => {
    if(err){
        return next(err);
    }
    

if (result.length === 0) {
    return res.send('login', {message:'login failed username not found'});
}
const hashedPassword = result[0].hashedPassword;

bcrypt.compare(plainPassword, hashedPassword, function(err, isMatch){
    if(err){
        return next(err);
        
    }
    if(isMatch){
        req.session.userId = req.body.username;
        return res.render('watchlist')
   

    }else{
        res.send( 'login failed: incorrect password ')
    }
   });
});
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})


module.exports = router
