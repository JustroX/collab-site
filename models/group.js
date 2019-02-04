var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
		name: String,
		description: String,
		ranks:
		[{
			name: String,
			permissions: Number
		}],
		users: 
		[{
		 	user: { type: Schema.Types.ObjectId , ref: "User" },
		 	rank: Schema.Types.ObjectId,
		}],
	 	users_pending : 
	 	[{ 
	 		user: { type: Schema.Types.ObjectId, ref: "User"}, 
	 		message: String 
	 	}],	
	 	badges_required:
	 	[{ 
	 		badge: {type: Schema.Types.ObjectId , ref: "Badge"} 
	 	}],
	 	created_by: {type: Schema.Types.ObjectId , ref: "User" },
  	},
  	required:
  	{
  		name: 1,
  		description: 1,
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
		users: "name",
		created_by: "fullname email",
	},
	permissions:
	{
		_id: 1,
		name: 7,
		
		users_pending: 15,
		ranks: 15,
		users: 15,
		badges_required: 15,
	},
	methods:
	{
	},
	endpoints:
	{
		users_pending : 
		{
			populate:
			{
				"user": "name fullname email"
			},
			_id: 1,
			user: 7,
			badges_required: 1,
		},
		ranks:
		{
			_id: 1,
			name: 7,
			permission: 7,
		},
		users: 
		{
			populate:
			{
				user: "name fullname email"
			},
			_id: 1,
			user: 7,
			rank: 7
		},
		badges_required:
		{
			_id: 1,
			badge: 7,
		}
	},
	default:
	{
		permission: 7,
	}
}