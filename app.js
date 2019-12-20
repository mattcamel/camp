const express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	methodOverride = require("method-override"),
	flash 		= require('connect-flash'),
	passport	= require('passport'),
	LocalStrategy = require('passport-local'),
	Campground  = require("./models/campground"),
	Comment 	= require("./models/comment"),
	Photo		= require("./models/photo"),
	User		= require("./models/user"),
	seedDB 		= require("./seeds");

const campgroundRoutes 	= require("./routes/campgrounds"),
		commentRoutes 	= require("./routes/comments"),
		indexRoutes 	= require("./routes/index"),
		photoRoutes 	= require("./routes/photos");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp_v12';
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR: ', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

//seedDB(); //seed dbs

app.locals.moment = require('moment');

//Passport initialization---------------------
app.use(require('express-session')({
	secret: 'bababooey',
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds/:id/photos', photoRoutes);

const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, () => {
	console.log("Yelp Camp server listening");
});

console.log(process.env.PORT);
console.log(port);
console.log(process.env.DATABASEURL);
console.log(url);