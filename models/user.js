var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	
   name: String,
   bio: String,
   birthday: Date,
   school: String,
   privileges : [ String ],

   // guilds: [ { type: Schema.Types.ObjectId, ref : 'Guild' } ],
   // // *guilds_created: [ guild_id ],     

   // posts: [ { type: Schema.Types.ObjectId, ref : 'Post' } ],
   // likes : [post_id],
   // shares : [post_id],

   // modules: [module_id],
   // articles : [article_id],
   // submissions: [submission_id],  

   // badges: [badge_id], 
   // follows: [user_id],
   // followed_by : [user_id]

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