var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var GuildSchema = mongoose.Schema({
	
   name: String,
   description: String,
   ranks: [ 
   			{ 
   				name : String,
   				permission_settings : Number,
   				permission_members  : Number,
   				permission_posts    : Number,
   			} ],

   users: [ { user: Schema.Types.ObjectId , ranks: [] } ],
   modules: [Schema.Types.ObjectId],
   posts: [Schema.Types.ObjectId],
   badges_required: [Schema.Types.ObjectId],

   created_by : Schema.Types.ObjectId
  
});

GuildSchema.methods.validateInputs = function()
{
	return this.name && this.birthday && 
		(
			( this.private.local.email && this.private.local.password  )
		) 
}

module.exports = mongoose.model('Guild', GuildSchema);