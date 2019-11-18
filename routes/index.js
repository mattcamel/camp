const express = require('express'),
	router	= express.Router(),
	passport = require('passport'),
	User 	= require('../models/user'),
	Comment = require('../models/comment'),
	Campground = require('../models/campground'),
	middleware = require('../middleware');

//Landing ROUTE
router.get("/", (req,res) => {
	// Campground.find({}, (err,items) => {
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		const photos = [];
	// 		for(let i =0; i<items.length; i++){
	// 			photos.push(items[i].image);
	// 		}
	// 		res.render("landing", {photos: photos});	
	// 	}
	// });
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
			const newUser = new User({username: req.body.username});
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
		// popupS.alert({content:"Passwords do not match"});
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

// router.post('/login', function(req, res){
// 	try{
// 		passport.authenticate('local')(req,res,function(){
// 			req.flash('success', 'You are now logged in ' + user.username);
// 			res.redirect(req.session.returnTo || '/');
// 			delete req.session.returnTo;
// 		});
// 	}catch(err){
// 		console.log(err);
// 		req.flash('error', err.message);
// 	}
// });

//LOGOUT ROUTE
router.get('/logout', (req,res) => {
	req.logout();
	req.flash('success', 'You are now logged out.');
	res.redirect('/campgrounds');
});

//SHOW ROUTE (USER PROFILE)
router.get('/profile/:id', middleware.verifyUser, (req,res) => {
	User.findById(req.params.id, (err,foundUser) => {
		if(err){
			console.log(err);
		}
		res.render('users/profile', {user: foundUser});
	})
	// Comment.find({author: req.params.username}, function(err,foundComments){
	// 	// if(err){
	// 	// 	console.log(err);
	// 	// }else{
	// 	// 	res.render('users/profile', {comments:foundComments});
	// 	// }
	// })
});

//PASSWORD EDIT SHOW ROUTE
// router.get('/profile/:username/edit', isLoggedIn, function(req,res){
// 	User.findById(req.user._id, function(err,foundUser){
// 		if(err){
// 			console.log(err);
// 			return res.redirect('/profile/' + req.user._id);
// 		}
// 		res.render('users/edit');
// 	})
// });

//PASSWORD UPDATE ROUTE
// router.put('/profile/:username', isLoggedIn, async function(req,res){
// 	console.log('password update put request initiated');
// 	if(req.body.currentPasssword === req.user.password && req.body.newPassword === req.body.confirmPassword){
// 		console.log('passwords ok');
// 		try{
// 			const newUser = req.user;
// 			await newUser.setPassword(req.body.newPassword);
// 			await newUser.save();
// 			console.log('user saved');
// 		}catch(err){
// 			console.log(err);
// 			res.redirect('/profile/' + req.user._id + '/edit');
// 		}
// 		passport.authenticate('local')(req,res,function(){
// 			res.redirect('/campgrounds');
// 		});
// 	}
// });


//Export
module.exports = router;