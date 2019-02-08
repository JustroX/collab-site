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
		createdAt: { type: Date, expires: '3d', default: Date.now },
		confirmed: Boolean,
	},
	permissions:
	{
		email : 3,
		invited_by : 1,
		createdAt: 1,
		confirmed: 1,
	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual: {},
	populate: 
	{
		"user" : "name username fullname email",
	},
	required:
	{
		email: 1,
	},
	default:
	{
		permission : 7,
	},
	endpoints:
	{

	},
	methods:
	{

	}
}