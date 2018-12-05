var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ChallengeSchema = mongoose.Schema({
	title: String,
	content: String,
	testcases: [ { input: String , output: String, sample: Boolean } ], 
	module: Schema.Types.ObjectId,
	authors: [Schema.Types.ObjectId],
	submissions: [ Schema.Types.ObjectId ],
	output_type: Number,
	/*
		0 - code
		1 - value
	*/	
});


module.exports = mongoose.model('Challenge', ChallengeSchema);