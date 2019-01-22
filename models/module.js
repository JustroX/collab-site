var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ModuleSchema = mongoose.Schema({
   name: String, 
   description: String, 
   guild: Schema.Types.ObjectId,
   badges: [Schema.Types.ObjectId ],
   articles: [{ page: Number, article:{ type: Schema.Types.ObjectId , ref : "Article" }}],
   challenges: [{ page: Number, challenge:{ type: Schema.Types.ObjectId, ref: "Challenge"}  }],
   users: [{ type: Schema.Types.ObjectId , ref : "User" } ]
  
});

ModuleSchema.methods.is_registered = function(user)
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

module.exports = mongoose.model('Module', ModuleSchema);