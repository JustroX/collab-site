var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var Group ;

module.exports = 
{
	schema:
	{
		name: String,
		description: String,
		
		group: { type: Schema.Types.ObjectId , ref: "Group" },

		articles: 
		[{ 
			page: Number,
			content: { type: Schema.Types.ObjectId , ref: "Article"  } 
		}],
		challenges: 
		[{ 
			page: Number,
			content: { type: Schema.Types.ObjectId , ref: "Challenge"  }
		}],

		badges: 
		[{ 
			badge: {type: Schema.Types.ObjectId, ref: "Badge"}
		}],
		users: [ { type: Schema.Types.ObjectId, ref: "User" } ]
	},
	endpoints:
	{
		articles:
		{
			populate:
			{
				content: "title",
			},
			page: 7,
			content: 3,
		},
		challenges:
		{
			populate:
			{
				content: "",
			},
			page: 5,
			content: 3,
		},
		badges:
		{
			populate: 
			{
				badge: "name"
			},
			badge: 3,
		},
	},
	endpoint_permissions:
	{
		articles: 15,
		challenges: 15,
		badges: 15
	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual:
	{
	
	},
	populate: 
	{

	},
	permissions:
	{
		name: 7,
		description: 7,
		group: 3,
	},
	required:
	{
	
	},
	default:
	{
		permission : 15,
	},
	methods:
	{
		is_registered: function(user)
		{
			if(!this.users.length)
				return false;

			for(let i in this.users)
			{
				if( (typeof this.users[i] == "object") && (this.users[i].equals) && this.users[i].equals(user))
					return true;
			}
			return false;
		},

		is_authorized: function(req,res,num,cb)
		{
			if(!Group) Group = require("./model_divider.js").model("Group");

			Group.findById( this.group , function(err,group)
			{
				if(err) return res.send({ err: "Database Error" , code:  500 });
				group.is_authorized(req,res,"module",num,cb);
			});
		}
	}
}