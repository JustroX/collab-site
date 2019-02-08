var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
		title: String,
		content: String,
		module: { type: Schema.Types.ObjectId , ref: "Module"},
		authors: [{ user: { type: Schema.Types.ObjectId , ref: "User"} }],	
	},
	permissions:
	{
		title: 7,
		content: 5,
		module: 3,
		authors: 15,
	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual: {},
	populate: 
	{
		"authors.user": "name fullname email username"
	},
	required:
	{
		title: 1,
		module: 1,
	},
	default:
	{
		permission : 7,
		self: 5,
	},
	endpoints:
	{
	},
	methods:
	{

	}
}