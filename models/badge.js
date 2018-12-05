var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var BadgeSchema = mongoose.Schema({
	
	name: String,
	title: String,
	asset: Buffer,
	created_by: Schema.Types.ObjectId

});


module.exports = mongoose.model('Badge', BadgeSchema);