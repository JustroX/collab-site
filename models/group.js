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
			permissions: 
			{
				group: Number,
				users: Number,
				module: Number,
				post: Number,
			},
			default: Boolean,
			persistent: Boolean,
		}],
		users: 
		[{
		 	user: { type: Schema.Types.ObjectId , ref: "User" },
		 	rank: Schema.Types.ObjectId,
		}],
	 	users_pending : 
	 	[{ 
	 		user: { type: Schema.Types.ObjectId, ref: "User"}, 
	 		message: String ,
	 		date: Date
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
		created_by: "fullname email",
		"badges_required.badge": "name description"
	},
	permissions:
	{
		_id: 1,
		name: 7,
		description: 7,

		"users": 1,
		badges_required: 13,
		ranks: 13,
	},
	endpoint_permissions:
	{
		users_pending: 15,
		ranks: 15,
		users: 15,
		badges_required: 15,
	},
	methods:
	{
		get_permission: function(user_id,field)
		{
			let rank_id = -1;
			for(let i of this.users)
			{
				if(i.user.equals(user_id))
				{
					rank_id = i.rank;	
				}
			}
			if(rank_id<0) return 0;
			for(let i of this.ranks)
			{
				if(i._id.equals(rank_id))
				{
					return i.permissions[field];
				}
			}
		},
		is_authorized: function(req,res,field,num,cb)
		{
			cb((this.get_permission(req.session.passport.user,field)&num)? true : false);
		},
		is_authorized_sync:function(req,res,field,num)
		{
			return (this.get_permission(req.session.passport.user,field)&num)? true : false;
		},
		is_badge_complete: function(user)
		{
			let complete =true;
			for(let i of this.badges_required)
			{
				for(let j of user.badges)
					if(i.badge == j.badge)
						continue;
				complete = false;
				break;
			}
			return complete;
		},
		get_default_rank : function()
		{
			for(let i of this.ranks)
				if(i.default)
					return i._id;
			console.log("default rank not found");
		}
	},
	endpoints:
	{
		users_pending : 
		{
			populate:
			{
				"user": "name fullname email profile_pic"
			},
			_id: 1,
			user: 7,
			message: 7,
			badges_required: 1,
		},
		ranks:
		{
			_id: 1,
			name: 7,
			permissions: 7,
			default: 7,
		},
		users: 
		{
			populate:
			{
				user: "name fullname email profile_pic"
			},
			_id: 1,
			user: 7,
			rank: 7
		},
		badges_required:
		{
			populate:
			{
				badge: "name description"
			},
			_id: 1,
			badge: 7,
		}
	},
	default:
	{
		permission: 7,
	}
}