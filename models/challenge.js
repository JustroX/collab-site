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
		
		
		output_type: Number, // 0 : code , 1 : value 	
		settings: 
		{ 
			languages: [String],
			testcase_description: String,
			data_type: String,
			precision: Number,
			strip: Boolean
		},

		answer   : String,
		
		authors: [{	user: { type: Schema.Types.ObjectId , ref: "User"}}],
		testcases: 
		[{
			input: String ,
			output: String,
			sample: Boolean,
			points: Number 
		}],
	},
	permissions:
	{
		_id: 1,
		title: 7,
		module: 3,

		content: 5,
		output_type: 5,

		settings: 5,
		answer: 5,

		authors: 13,
		testcases: 13,

	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual: {},
	populate: 
	{
		"authors.user": "name fullname email username",
		"module": "name",
	},
	required:
	{
		title: 1,
		module: 1,
	},
	default:
	{
		permission : 15,
		self: 5,
	},
	endpoints:
	{
		testcases:
		{
			input: 7,
			output: 7,
			sample: 7,
			points: 7,
		}
	},
	methods:
	{

	}
}