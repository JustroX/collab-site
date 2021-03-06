var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
		email : String,
		invited_by : { type: Schema.Types.ObjectId , ref: "User"},
		user       : { type: Schema.Types.ObjectId , ref: "User"},
		createdAt  : { type: Date, expires: '3d', default: Date.now },
		confirmed: Boolean,
	},
	permissions:
	{
		_id: 1,
		email : 3,
		invited_by : 3,
		createdAt: 1,
		confirmed: 7,
		user: 1,
	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual: {},
	populate: 
	{
		"invited_by" : "name username fullname email",
	},
	required:
	{
		email: 1,
	},
	default:
	{
		permission : 15,
	},
	endpoints:
	{

	},
	methods:
	{

	}
}