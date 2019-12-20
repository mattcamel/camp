const express 	= require('express'),
	router 		= express.Router(),
	Campground 	= require('../models/campground'),
	Comment 	= require('../models/campground'),
	Photo 		= require('../models/photo'),
	middleware 	= require('../middleware');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

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

//SEARCH ROUTE
router.get('/results', async (req,res) => {
	if (req.query.search) {
		try{
			const regex = new RegExp(escapeRegex(req.query.search), 'gi');
			let results = await Campground.find({"name": regex});
			Array.prototype.push.apply(results, await Campground.find({"location": regex}));
			results = [...new Set(results)];
			res.render("campgrounds/results", { campgrounds: results });
		}catch(err){
			console.log(err);
		}
    }
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req,res) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, async (req,res) => {
	try{
		const newCampground = req.body.campground;
		newCampground.author = {id: req.user._id, username: req.user.username};
		const newlyCreated = await Campground.create(newCampground);
		const newPhoto = {src: req.body.campground.image, author: newCampground.author};
		const newlyAdded = await Photo.create(newPhoto);
		req.flash('success', 'New campground successfully created!');
		res.redirect("/campgrounds/" + newlyCreated._id);
	}catch(err){
		console.log(err);
		req.flash('error', 'Something went wrong. ' + err.message);
	}
});

//SHOW ROUTE
router.get("/:id", middleware.isValidCampId, (req,res) => {
	Campground.findById(req.params.id).populate("comments").populate("photos").exec((err,foundCampground) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

router.get("/:id/photos", (req,res) => {
	Campground.findById(req.params.id).populate("photos").exec((err,foundCampground) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show2_photos",{campground:foundCampground});
		}
	});
});

router.get("/:id/comments", (req,res) => {
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show3_comments",{campground:foundCampground});
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
router.put("/:id", middleware.checkCampOwnership, (req,res) => {
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