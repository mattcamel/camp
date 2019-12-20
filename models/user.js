var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username:{type:String, unique:true, required:true},
	password:{type:String, required:true},
	firstName:String,
	lastName:String,
	bio:String,
	email:{type:String, unique:true},
	admin:{type:Boolean, default:false},
	campgrounds:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Campground'
		}
	],
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Campground'
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);