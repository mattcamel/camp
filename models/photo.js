var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
	src:String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username:String
	},
	createdAt:{type: Date, default: Date.now},
});

module.exports = mongoose.model("Photo", photoSchema);