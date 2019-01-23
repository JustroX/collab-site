var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ChallengeSchema = mongoose.Schema({
	title: String,
	content: String,
	module: { type: Schema.Types.ObjectId , ref: "Module"},
	authors: [{ type: Schema.Types.ObjectId , ref: "User"}],
	submissions: [ {type: Schema.Types.ObjectId , ref: "Submission"} ],
	
	output_type: Number,
	/*
		0 - code
		1 - value
	*/	
	settings: 
	{ 
		languages: [String],
		testcase_description: String,
		data_type: String,
		precision: Number,
		strip: Boolean
	},
	answer   : String,
	testcases: [ { input: String , output: String, sample: Boolean, points: Number } ],
	
});


module.exports = mongoose.model('Challenge', ChallengeSchema);