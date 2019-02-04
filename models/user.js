var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var mongoose  = require('mongoose');
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

		follows: 
		[{ 
			user : {type: Schema.Types.ObjectId, ref: "User"}
		}],
		
		followed_by: [{type: Schema.Types.ObjectId, ref: "User"}],

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
				this.set("private.local.password",this.generateHash(val));
			}
		}
	},
	populate: {},
	permissions:
	{
	   _id: 1, 
	   name: 7,
	   bio: 7,
	   birthday: 7,
	   school: 7,
	   username: 7,
	   sex: 7,
	   confirmed: 1,
	   email: 7,

	   private: 0,
	   fullname: 1,
	   authorization: 0,
	   password: 4,

	   follows: 15,
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
		follows:
		{
			populate:
			{
				user: "name fullname email"
			},

			_id: 1,
			user: 3	
		}
	},
	methods:
	{
		generateHash: function(password)
		{
			return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
		},
		validPassword: function(password)
		{
			return bcrypt.compareSync(password,this.private.local.password);
		}
	}
}