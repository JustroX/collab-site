var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	authors: [{ type: Schema.Types.ObjectId , ref: "User"}],
	module: { type: Schema.Types.ObjectId, ref: "Module"}
});


module.exports = mongoose.model('Article', ArticleSchema);