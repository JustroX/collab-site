var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
		name: String,
		description: String,
		asset: Buffer,
		created_by: { type:Schema.Types.ObjectId ,ref:"User"},
		date: { type: Date ,  default: Date.now }
	},
	permissions:
	{
		_id: 1,
		name: 7,
		description: 7,
		asset: 5,
		created_by: 1,
		date: 1

	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual: {},
	populate: 
	{
		created_by: "name username email fullname"
	},
	required:
	{
		name: 1,
		description: 1,
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