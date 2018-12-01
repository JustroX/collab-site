var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/*
   In group permissions
   
   Settings 
   - edit  delete
   0    0       0
   1    1       0
   2    0       1
   3    1       1

   Members
   - add edit  delete
   0    0   0       0
   1    1   0       0
   2    0   1       0
   3    1   1       0
   4    0   0       1
   5    1   0       1
   6    0   1       1
   7    1   1       1

   Posts
   - remove
   0      0
   1      1



*/


var GuildSchema = mongoose.Schema({
	
   name: String,
   description: String,
   ranks: [ 
   			{ 
   				user : String,
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