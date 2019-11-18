const express = require('express'),
	router 	= express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/campground'),
	middleware = require('../middleware');

//INDEX ROUTE
router.get("/", (req,res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, page:'campgrounds'});
		}
	});
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req,res) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req,res) => {
	const newCampground = req.body.campground;
	newCampground.author = {id: req.user._id, username: req.user.username};
	Campground.create(newCampground, (err,newlyCreated) => {
		if(err){
			console.log(err);
			req.flash('error', 'Something went wrong.');
		}else{
			req.flash('success', 'New campground successfully created!');
			res.redirect("/campgrounds/" + newlyCreated._id);
		}
	});
});

//SHOW ROUTE
router.get("/:id", (req,res) => {
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampOwnership, (req,res) => {
	Campground.findById(req.params.id, (err,foundCampground) => {
		if(err){
			console.log(err);
			res.redirect('back');
		}else{
			res.render('campgrounds/edit', {foundCampground:foundCampground});
		}
	});
});

//UPDATE ROUTE
router.put("/:id/", middleware.checkCampOwnership, (req,res) => {
	const editedCampground = req.body.campground;
	editedCampground.author = {id: req.user._id, username: req.user.username};
	Campground.findByIdAndUpdate(req.params.id, editedCampground, (err,updatedCampground) => {
		if(err){
			console.log(err);
		}else{
			req.flash('success', 'Campground updated!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
});

//DESTROY ROUTE
router.delete("/:id/", middleware.checkCampOwnership, async (req,res) => {
	try{
		const removedCampground = await Campground.findByIdAndRemove(req.params.id);
		req.flash('success', 'Campground deleted.');
		res.redirect('/campgrounds');
	}catch(err){
		console.log(err);
	}
});


//Export
module.exports = router;