var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var BadgeSchema = mongoose.Schema({
	
	name: String,
	title: String,
	asset: Buffer,
	created_by: { type:Schema.Types.ObjectId ,ref:"User"},
	created_by_guild:  Schema.Types.ObjectId,
	date: { type: Date ,  default: Date.now }

});


module.exports = mongoose.model('Badge', BadgeSchema);