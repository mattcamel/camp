const express = require('express'),
	router	= express.Router(),
	passport = require('passport'),
	User 	= require('../models/user'),
	Comment = require('../models/comment'),
	Campground = require('../models/campground'),
	middleware = require('../middleware');

//Landing ROUTE
router.get("/", (req,res) => {
	res.render("landing");
});

//NEW ROUTE
router.get('/register', (req,res) => {
	res.render('users/register', {page: 'register'});
});

//CREATE ROUTE
router.post('/register', async (req,res) => {
	if(req.body.password === req.body.passwordConfirm){
		try{
			const newUser = await new User({username: req.body.username});
			await User.register(newUser, req.body.password);
			passport.authenticate('local')(req,res, () => {
				req.flash('success', 'Welcome to Yelp Camp ' + req.user.username);
				res.redirect('/campgrounds');
			});
		}catch(err){
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/register');
		}
	}else{
		req.flash('error', 'Your passwords do not match.')
		res.redirect('/register');
	}
});

//LOGIN SHOW ROUTE
router.get('/login', (req,res) => {
	res.render('users/login', {page:'login'});
});

//LOGIN UPDATE ROUTE
router.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/login",
		failureFlash: true
    }), (req, res) => {
	req.flash('success', 'Welcome back ' + req.user.username);
	res.redirect('/campgrounds');
});

//LOGOUT ROUTE
router.get('/logout', (req,res) => {
	req.logout();
	req.flash('success', 'You are now logged out.');
	res.redirect('/campgrounds');
});

//SHOW ROUTE (USER PROFILE)
router.get('/profile/:id', middleware.verifyUser, async (req,res) => {
	try{
		const foundUser = await User.findById(req.params.id).populate('campgrounds').populate('comments').exec();
		res.render('users/profile', {user: foundUser});
	}catch(err){
		console.log(err);
	}
});	

//PASSWORD EDIT SHOW ROUTE
router.get('/profile/:id/edit', middleware.verifyUser, async (req,res) => {
	try{
		const foundUser = await User.findById(req.user._id);
		res.render('users/edit', {user:foundUser});
	}catch(err){
		console.log(err);
		return res.redirect('/profile/' + req.user._id);
	}
});

//PASSWORD UPDATE ROUTE
router.put('/profile/:id', middleware.isLoggedIn, (req,res) => {
	if(req.body.password === req.body.confirm){
		try{
			console.log('new passwords ok');
			const currUser = req.user;
			currUser.setPassword(req.body.password);
			currUser.save();
			console.log('new password saved');
			req.flash('success', 'Password updated.');
			res.redirect(`/profile/${req.user._id}`);
		}catch(err){
			console.log(err);
			req.flash('error', 'Something went wrong.');
			res.redirect(`/profile/${req.user._id}/edit`);
		}
	}else{
		req.flash('error', 'Your new passwords do not match.');
		res.redirect(`/profile/${req.user._id}/edit`);
	}
});


//Export
module.exports = router;