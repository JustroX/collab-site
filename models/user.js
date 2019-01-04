var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	
   name: String,
   firstname: String,
   lastname: String,
   bio: String,
   birthday: Date,
   school: String,
   username: String,
   privileges : [ String ],
   sex: String,
   confirmed: Boolean,

   admin_user_permissions : Number,
   admin_guild_permissions : Number, 
   /*
		   add edit delete
		0    0    0      0
		1    1    0      0
		2    0    1      0
		3    1    1      0
		4    0    0      1
		5    1    0      1
		6    0    1      1
		7    1    1      1
   */

   badge_permission : Number,
   /*
		   add edit delete
		0    0    0      0
		1    1    0      0
		2    0    1      0
		3    1    1      0
		4    0    0      1
		5    1    0      1
		6    0    1      1
		7    1    1      1
   */


   guilds: [ Schema.Types.ObjectId ],
   // *guilds_created: [ guild_id ],     

   	posts: [ Schema.Types.ObjectId ],
   	likes : [Schema.Types.ObjectId],
   	shares : [Schema.Types.ObjectId],

   	modules: [Schema.Types.ObjectId],
   	articles : [Schema.Types.ObjectId],
   	submissions: [Schema.Types.ObjectId],  

	badges: [{ type: Schema.Types.ObjectId, ref: "Badge"}], 
   	follows: [Schema.Types.ObjectId],
   	followed_by : [Schema.Types.ObjectId],

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
});

UserSchema.methods.generateHash = function(password)
{
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}


UserSchema.methods.validPassword  = function(password)
{
	return bcrypt.compareSync(password,this.private.local.password);
}

UserSchema.methods.validateInputs = function()
{
	return this.name && this.birthday && 
		(
			( this.private.local.email && this.private.local.password  )
		) 
}

module.exports = mongoose.model('User', UserSchema);