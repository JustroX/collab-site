var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	authors: [Schema.Types.ObjectId],
	module: Schema.Types.ObjectId
});


module.exports = mongoose.model('Article', ArticleSchema);