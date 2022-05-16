const express = require("express");
const router = express.Router();
const User = require("../model/user");
const CatchAsync = require("../utilis/CatchAsync")

router.get('/signup', (req, res) => {
  res.render('user/signup');
})
router.post('/signup', CatchAsync(async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await new User({ username, email });
    const validuser = await User.register(user, password);
    req.login(validuser, err => {
      if (err) return next(err)
      req.flash("Success", 'Logged In Successfully');
      res.redirect('/campgrounds');
    })
  }
  catch (e) {
    req.flash('Error', e.message);
    res.redirect('/signup');
  }
}))

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('Success', "Logged You Out")
  res.redirect("/campgrounds");
})


module.exports = router; 