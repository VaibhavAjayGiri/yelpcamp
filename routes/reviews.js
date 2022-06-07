const express = require("express");
const router = express.Router({mergeParams : true });
const CatchAsync = require("../utilis/CatchAsync")
const { reviewSchema } = require('../Schemas');
const Review = require("../model/review");
const Campground = require('../model/campground');
const ExpressError = require('../utilis/ExpressError')
const { isReviewAuthor , isLoggedIn} = require('../middleware') ;  
const review = require("../model/review");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else {
        next();
    }
}


router.post('/',validateReview , isReviewAuthor ,isLoggedIn, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    req.flash('Success' , 'SuccessFully Added Your Review');
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.get('/:reviewId', isLoggedIn, isReviewAuthor,CatchAsync(async(req,res)=>{
    const {id ,reviewId} = req.params ; 
    await Campground.findByIdAndUpdate(id , {$pull : {reviews :reviewId }})
    await Review.findByIdAndDelete(reviewId); 
    req.flash('Success' , 'SuccessFully Deleted Your');
    res.redirect(`/campgrounds/${id}`);
}))





module.exports = router 