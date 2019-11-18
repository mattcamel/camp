//MIDDLEWARE
const Campground = require('../models/campground'),
	  User = require('../models/user'),
	  Comment = require('../models/comment');

const middlewareObj = {};

isAdmin = function(req,res,next){
	return req.user.admin;
}

middlewareObj.isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.session.returnTo = req.originalUrl; 
	// req.session.returnTo = req.header('Referer');
	req.flash('error', 'You must be logged in to do that.');
	res.redirect('/login');
};

middlewareObj.verifyUser = async (req,res,next) => {
	try{
		console.log('verifyUser called');
		console.log(req.user);
		if(req.isAuthenticated() || req.user.admin){
			const foundUser = await User.findById(req.params.id);
			if(foundUser._id.equals(req.user._id)){
				return next();
			}
		}
	}catch(err){
		console.log(err);
	};
	req.flash('error', 'You do not have permission to do that.');
	return res.redirect(req.header('Referer') || '/');
};

middlewareObj.checkCampOwnership = async (req,res,next) => {
	try{
		// console.log('checkCampOwnership called');
		// console.log(req.user);
		// console.log(req.user.admin);
		if(req.isAuthenticated()){
			const foundCampground = await Campground.findById(req.params.id);
			if(foundCampground.author.id.equals(req.user._id) || req.user.admin){
				return next();
			}
		}
	}catch(err){
		console.log(err);
	};
	req.flash('error', 'You do not have permission to do that.');
  	return res.redirect('back');
};

middlewareObj.checkCommentOwnership = async (req,res,next) => {
	try{
		if(req.isAuthenticated() || req.user.admin){
			const foundComment = await Comment.findById(req.params.idCom);
			if(foundComment.author.id.equals(req.user._id)){
				return next();
			}
		}
	}catch(err){
		console.log(err);
	};
	req.flash('error', 'You do not have permission to do that.');
	return res.redirect('back');
};


//EXPORT
module.exports = middlewareObj;