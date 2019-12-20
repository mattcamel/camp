const express = require('express'),
	router	= express.Router({mergeParams: true}),
	Campground = require('../models/campground'),
	Photo = require('../models/photo'),
	middleware = require('../middleware');

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, async (req,res) => {
	try{
		const foundCampground = await Campground.findById(req.params.id);
		res.render("photos/new", {campground:foundCampground});
	}catch(err){
		console.log(err);
	}
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, async (req,res) => {
	try{
		const newPhoto = await req.body.photo;
		newPhoto.author = {id: await req.user._id, username: await req.user.username};
		const photo = await Photo.create(newPhoto);
		const foundCampground = await Campground.findById(req.params.id);
		await foundCampground.photos.push(photo);
		await foundCampground.save();
		req.flash('success', 'Photo added!');
		res.redirect(`/campgrounds/${foundCampground._id}/photos`);
	}catch(err){
		console.log(err);
		req.flash('error', 'Something went wrong.');
	}
});

//DESTROY ROUTE
router.delete("/:photo_id", middleware.checkPhotoOwnership, async (req,res) => {
	try{
		const removedPhoto = await Photo.findByIdAndRemove(req.params.photo_id);
		req.flash('success', 'Comment deleted.');
		res.redirect(`/campgrounds/${foundCampground._id}/photos`);
	}catch(err){
		console.log(err);
	}
});


//Export
module.exports = router;