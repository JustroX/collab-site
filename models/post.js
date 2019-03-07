var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
	   content: String,
	   group : { type: Schema.Types.ObjectId, ref: 'Group'},
	   date : Date,
	   author    : { type: Schema.Types.ObjectId, ref: 'User'},
	   wall : Boolean,
	   
	   liked_by  : 
	   [{ 
	   		user:{ type: Schema.Types.ObjectId, ref: 'User'} 
	   	}],
	   shared_by : 
	    [{ 
	   		user:   { type: Schema.Types.ObjectId, ref: 'User'} , 
	   		group:  { type: Schema.Types.ObjectId, ref: 'User'}  ,
	   		wall: Boolean
	   	}],
	   replies   : 
	   [{ 
			post:{ type: Schema.Types.ObjectId, ref: 'Post'},
		}],

	   parent    : {type: Schema.Types.ObjectId, ref: 'Post'}
	},
  	required:
  	{
  		content: 1,
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
		"author" : "name username email"
	},
	permissions:
	{
		_id: 1,
		content: 7,
		group: 7,
		wall: 1,
		author: 1,
		date: 1,

		liked_by : 13,
		shared_by : 13,
		replies : 13,
	},
	methods:
	{

	},
	endpoints:
	{
		liked_by:
		{
			_id: 1,
			user: 15,
			populate:
			{
				user: "name username email"
			}
		},
		shared_by:
		{
			user: 1,
			group: 1,
			wall: 1,
		},
		replies:
		{
			user: 1,
			populate:
			{
				user: "name username email"
			}
		},
	},
	endpoint_permissions:
	{
		liked_by: 15,
		shared_by: 15,
		replies: 15
	},
	default:
	{
		permission: 15,
	}
}