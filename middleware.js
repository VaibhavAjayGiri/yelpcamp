const Campground = require('./model/campground');
const Review = require('./model/review');
const ExpressError = require('./utilis/ExpressError')


module.exports.isLoggedIn = (req,res,next)=>{
    req.session.returnTo = req.originalUrl ;
    if(!req.isAuthenticated()){
        req.flash('error',"You Must Be Logged In First"); 
        return res.redirect('/login');
    } else next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("Error", 'You dont have the permission to do so');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("Error", 'You dont have the permission to do so');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}