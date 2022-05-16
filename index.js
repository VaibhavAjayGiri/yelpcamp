const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const Campground = require('./model/campground');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilis/ExpressError')
const CatchAsync = require("./utilis/CatchAsync")
const { send } = require("process");
const Review = require("./model/review")
// const {campgroundSchema} = require('./Schemas.js')
const { reviewSchema } = require('./Schemas');
const review = require("./model/review");
// const campground = require("./model/campground");
const campgroundroutes = require('./routes/campground');
const reviewroutes = require('./routes/reviews')
const userRoutes = require('./routes/User');
const loginRoutes = require("./routes/login");
const session = require('express-session') ;
const flash = require('connect-flash') ; 
const passport = require("passport") ; 
const localStrategy = require("passport-local");
const User = require("./model/user");

mongoose.connect('mongodb://localhost:27017/moviesApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(data => {
        console.log('DataBase Conneted')
    })
    .catch(err => {
        console.log("Error Accored")
        console.log(err);
    })


const Sessionconfig = {
    secret: 'thisshouldbeabetterone!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session(Sessionconfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/fake',async(req,res)=>{
//     const user = new User({email : 'vaibhav123$gmail.com' , username : 'vaibhavvv'}) ; 
//     const realUser = await User.register(user , 'monkey');
//     res.send(realUser);
// })
app.use((req,res,next)=>{
    res.locals.currentUser = req.user ;
    res.locals.success = req.flash('Success');
    res.locals.error = req.flash('Error' , 'Wrong Credentials') ;
    next() ;
})
app.use('/',userRoutes);
app.use('/', loginRoutes);
app.use('/campgrounds', campgroundroutes);
app.use('/campgrounds/:id/reviews', reviewroutes);
app.use(express.static(path.join(__dirname, 'public')))
// const validationSchemas = (req,res,next)=>{
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 404)
//     }
//     else{
//         next();
//     }
// }

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 404)
//     }
//     else {
//         next();
//     }
// }

// app.get('/', (req, res) => {
//     res.render('home')
// })

// app.get('/campgrounds', CatchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campground/index', { campgrounds })
// }))

// app.get('/campgrounds/new', (req, res) => {
//     res.render('campground/new')
// })
// app.post('/campgrounds', CatchAsync(async (req, res, next) => {
//     if (!req.body) {
//         throw new Error('Invalid Page', 404)
//     }
//     const newCamp = new Campground(req.body);
//     await newCamp.save();
//     res.redirect(`/campgrounds/${newCamp._id}`)
// }))
// app.get('/campgrounds/:id', CatchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     res.render('campground/show', { campground })
// }))
// app.get('/campgrounds/:id/edit', CatchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render('campground/edit', { campground })
// }))
// app.put('/campgrounds/:id', CatchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true });
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.delete('/campgrounds/:id', CatchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds')
// }))

// app.post('/campgrounds/:id/reviews',validateReview , CatchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save()
//     await campground.save()
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.get('/campgrounds/:id/reviews/:reviewId',CatchAsync(async(req,res)=>{
//     const {id ,reviewId} = req.params ; 
//     await Campground.findByIdAndUpdate(id , {$pull : {reviews :reviewId }})
//     await Review.findByIdAndDelete(reviewId); 
//     res.redirect(`/campgrounds/${id}`);
// }))
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'OH SOMETHING WENT WRONG';
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listining on port number 3000")
})


// if(err.message = 'page not found' && err.statusCode === 404){
//     send("DO THIS OR DO THAT");
// }

