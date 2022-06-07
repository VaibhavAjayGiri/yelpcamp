const express = require("express");
const router = express.Router();
const CatchAsync = require("../utilis/CatchAsync")
const ExpressError = require('../utilis/ExpressError')
const Campground = require('../model/campground');
const { isLoggedIn, isAuthor } = require('../middleware');

// const isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash("Error", 'You dont have the permission to do so');
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     next();
// }

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
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:
        {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', { campground })
}))
router.get('/:id/edit', isAuthor, isLoggedIn, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
}))
router.put('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('Error', "Can't Find Your Campground");
        return res.redirect('/campgrounds')
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true });
    req.flash('Success', 'SuccessFully Updated Your Campground');
    res.redirect(`/campgrounds/${campg._id}`)
}))
router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
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