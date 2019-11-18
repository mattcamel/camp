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
	User		= require("./models/user"),
	seedDB 		= require("./seeds");

const campgroundRoutes = require("./routes/campgrounds"),
		 commentRoutes = require("./routes/comments"),
		   indexRoutes = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
//test DB
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true});
//deployed DB
mongoose.connect("mongodb+srv://mattcamel:4z6r5q1T3xdfBBTv@cluster0-vmqtn.mongodb.net/test?retryWrites=true&w=majority", {
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

app.listen(process.env.PORT, process.env.IP);

// app.listen(3000, () => {
// 	console.log("Yelp Camp server listening");
// });