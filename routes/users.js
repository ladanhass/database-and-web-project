const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10 // defines salt rounds
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.render('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
};
router.get("/register" , function (req, res, next){
    res.render('register.ejs')
});
router.get("/login" , function (req, res, next){
    res.render('login.ejs')
});
router.post('/registered',
[
 check('email').isEmail().withMessage('provide a valid email'),
 check('plainPassword')
 .isLength({min: 8})
 .withMessage('Password must be atleat 8 characters long')
 .isAlphanumeric()
 .withMessage('password must only contain only numbers and letters'),
 check('first').notEmpty().withMessage('First name cannot be empty'),
 check('last').notEmpty().withMessage('last name cannot be empty'),
 check('username')
 .isLength({min:5})
 .withMessage('username must be atleate 5 characters long')



],
    function (req, res){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            
            res.redirect('./register');
         }
    
        const plainPassword = req.body.plainPassword;
        const username = req.sanitize(req.body.username);
        const firstName = req.sanitize(req.body.first);
        const lastName = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);

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
            return res.redirect('login');
     });
});
}
);
router.post('/loggedin', function (req, res, next){
    console.log(req.body);
    const plainPassword = req.body.plainPassword;
    const username = req.sanitize(req.body.username);

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
    res.redirect('./login');
    });
});


module.exports = router;
