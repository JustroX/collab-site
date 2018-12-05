var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ChallengeSchema = mongoose.Schema({

	title: String,
	content: String,
	testcases: [ { input: String , output: String, sample: Boolean } ], 
	module: Schema.Types.ObjectId,
	authors: [Schema.Types.ObjectId],

});


module.exports = mongoose.model('Challenge', ChallengeSchema);