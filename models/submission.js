var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var SubmissionSchema = mongoose.Schema({
	content : String,
   challenge: Schema.Types.ObjectId,
   author : Schema.Types.ObjectId,
   verdict: Object
});

module.exports = mongoose.model('Submission', SubmissionSchema);