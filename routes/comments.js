const express = require('express'),
	router	= express.Router({mergeParams: true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req,res) => {
	Campground.findById(req.params.id, (err,foundCampground) => {
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground:foundCampground});	
		}
	})
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, async (req,res) => {
	try{
		const newComment = req.body.comment;
		newComment.author = {id: req.user._id, username: req.user.username};
		const comment = await Comment.create(newComment);
		const foundCampground = await Campground.findById(req.params.id);
		await foundCampground.comments.push(comment);
		await foundCampground.save();
		req.flash('success', 'Comment added!');
		res.redirect("/campgrounds/" + foundCampground._id);
	}catch(err){
		console.log(err);
		req.flash('error', 'Something went wrong.');
	}
});

//EDIT ROUTE
router.get("/edit/:idCom", middleware.checkCommentOwnership, async (req,res) => {
	try{
		const foundCampground = await Campground.findById(req.params.id);
		const foundComment = await Comment.findById(req.params.idCom);
		res.render("comments/edit", {campground:foundCampground, comment:foundComment});
	}catch(err){
		console.log(err);
	};
});

//UPDATE ROUTE
router.put("/edit/:idCom", middleware.checkCommentOwnership, async (req,res) => {
	try{
		const newComment = req.body.comment;
		newComment.author = {id: req.user._id, username: req.user.username};
		const updatedComment = await Comment.findByIdAndUpdate(req.params.idCom, newComment);
		req.flash('success', 'Comment updated!');
		res.redirect("/campgrounds/" + req.params.id);
	}catch(err){
		console.log(err);
	};
});

//DESTROY ROUTE
router.delete("/edit/:idCom", middleware.checkCommentOwnership, (req,res) => {
	Comment.findByIdAndRemove(req.params.idCom, (err,removedComment) => {
		if(err){
			console.log(err);
		}else{
			req.flash('success', 'Comment deleted.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
});


//Export
module.exports = router;