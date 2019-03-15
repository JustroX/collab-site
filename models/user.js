var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

module.exports = 
{
	schema:
	{
		name: { first: String, middle: String, last: String },
		bio: String,
		birthday: Date,
		school: String,
		username: String,
		sex: String,
		confirmed: Boolean,

		profile_pic: String,

		follows: 
		[{ 
			user : {type: Schema.Types.ObjectId, ref: "User"}
		}],
		
		followed_by:  
		[{ 
			user : {type: Schema.Types.ObjectId, ref: "User"}
		}],
		badges: [{
			badge: {type: Schema.Types.ObjectId, ref: "Badge"}
		}],

		authorization: Object,
		private:
		{
			local:
			{
				email: String,
				password: String,
			},
		    facebook         : {
		        id           : String,
		        token        : String,
		        name         : String,
		        email        : String
		    },
		    twitter          : {
		        id           : String,
		        token        : String,
		        displayName  : String,
		        username     : String
		    },
		    google           : {
		        id           : String,
		        token        : String,
		        email        : String,
		        name         : String
		    }
		}
	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual:
	{
		fullname : 
		{
			get: function()
			{
				return this.name.first + " " + this.name.middle + " " + this.name.last;
			}
		},
		email:
		{
			get: function()
			{
				return this.private.local.email;
			},
			set: function(val)
			{
				this.set("private.local.email",val);
			}
		},
		password:
		{
			get: function()
			{
				return "";
			},
			set: function(val)
			{
				this.set("private.local.password",val);
			}
		}
	},
	populate: {},
	permissions:
	{
	   _id: 1, 
	   name: 5,
	   bio: 5,
	   birthday: 5,
	   school: 5,
	   username: 7,
	   sex: 5,
	   confirmed: 1,
	   email: 7,

	   profile_pic: 5,

	   private: 0,
	   fullname: 1,
	   authorization: 0,
	   password: 4,

	   follows: 13,
	   followed_by: 13,

	   badges: 13,
	},
	required:
	{
	   "name.first": 1,
	   "name.middle": 1,
	   "name.last": 1,
	   "email": 1,
	   "password": 1,
	},
	default:
	{
		permission : 1,
		self: 5,
	},
	endpoints:
	{
		followed_by:
		{
			_id: 1,
			user: 3	
		},

		badges:
		{
			populate:
			{
				user: "name"
			},

			_id: 1,
			badge: 3	
		}
	},
	endpoint_permissions:
	{
		followed_by: 15,
	},
	methods:
	{
		generateHash: function(password)
		{
			return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
		},
		validPassword: function(password)
		{
			console.log(password,this.password);
			 if(this.password != null) {
		        return bcrypt.compareSync(password, this.password);
		    } else {
		        return false;
		    }
		}
	}
}