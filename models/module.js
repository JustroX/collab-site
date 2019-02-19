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
			page: 7,
			content: 3,
		},
		challenges:
		{
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
		articles: 7,
		challenges: 7,
		badges: 7
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
		permission : 7,
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
		}
	}
}