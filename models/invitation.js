var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var InvitationSchema = mongoose.Schema({
	email : String,
	invited_by : { type: Schema.Types.ObjectId , ref: "User"},
	createdAt: { type: Date, expires: '3d', default: Date.now },
	confirmed: Boolean,
	user: {type: Schema.Types.ObjectId , ref: "User"}
});


module.exports = mongoose.model('Invitation', InvitationSchema);