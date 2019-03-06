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
		_id: 1,
		title: 7,
		content: 5,
		module: 3,
		authors: 13,
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
	},
	methods:
	{
		is_authorized : function(req,res,num,cb)
		{
			if(!Module) Module  =require("./model_divider.js").model("Module");
			Module.findById(this.module,function(err,mod)
			{
				if(err) return res.send({ err: "Database Error" , code:  500 });
				mod.is_authorized(req,res,num,cb);
			});
		}
	}
}