var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var NotificationSchema = mongoose.Schema({
	user : { type: Schema.Types.ObjectId , ref: "User"},
	content: "",
	date : Date,
});


module.exports = mongoose.model('Notification', NotificationSchema);