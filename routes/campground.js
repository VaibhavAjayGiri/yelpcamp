const express = require("express");
const router = express.Router();
const CatchAsync = require("../utilis/CatchAsync")
const ExpressError = require('../utilis/ExpressError')
const Campground = require('../model/campground');
const { isLoggedIn } = require('../middleware');



router.get('/', CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campground/new')
})
router.post('/', isLoggedIn, CatchAsync(async (req, res, next) => {
    if (!req.body) {
        throw new Error('Invalid Page', 404)
    }
    const newCamp = new Campground(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('Success', 'SuccessFully Created Your Campground');
    res.redirect(`/campgrounds/${newCamp._id}`)
}))
router.get('/:id', CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', { campground })
}))
router.get('/:id/edit', isLoggedIn, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
}))
router.put('/:id', isLoggedIn, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // if (!campground) {
    //     req.flash('Error', "Can't Find Your Campground");
    //     return res.redirect('/campgrounds')
    // }
    if(!campground.author.equals(req.user._id)){
        req.flash("Error",'You dont have the permission to do so');
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true });
    req.flash('Success', 'SuccessFully Updated Your Campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:id', isLoggedIn, CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    req.flash('Success', 'SuccessFully Deleted Your Campground');
    res.redirect('/campgrounds')
}))


module.exports = router 