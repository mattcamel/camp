const mongoose = require('mongoose'),
	  Comment = require('./comment');

//SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
			},
		username: String
		},
	name:{type:String, unique:true, requried:true},
	location:{type:String, requried:true},
	price: Number,
	image: String,
	photos:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Photo"
		}
	],
	description: String,
	createdAt: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

CampgroundSchema.pre('remove', async function() {
	await Comment.remove({_id: {$in: this.comments}});
});

module.exports = mongoose.model("Campground", CampgroundSchema);