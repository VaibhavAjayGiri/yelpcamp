module.exports.isLoggedIn = (req,res,next)=>{
    req.session.returnTo = req.originalUrl ;
    if(!req.isAuthenticated()){
        req.flash('error',"You Must Be Logged In First"); 
        return res.redirect('/login');
    } else next();
}

