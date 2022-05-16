const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user");

router.get("/login", (req, res) => {
    res.render("user/login");
})
router.post('/login', passport.authenticate('local', { failureFlash : true , failureRedirect: '/login' , failureMessage: true }), (req, res) => {
    req.flash("Success", 'Logged In Successfully');
    const path = req.session.returnTo || '/campgrounds' ; 
    delete req.session.returnTo ;
    res.redirect(path);
})



module.exports = router;

