var mongoose = require('mongoose');
const Comment = require('./comment');

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
			},
		username: String
		},
	name: String,
	price: Number,
	image: String,
	description: String,
	createdAt: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

campgroundSchema.pre('remove', async function() {
	await Comment.remove({_id: {$in: this.comments}});
});

module.exports = mongoose.model("Campground", campgroundSchema);