var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var ModuleSchema = mongoose.Schema({
   name: String, 
   guild: Schema.Types.ObjectId,
   badges: [Schema.Types.ObjectId ],
   articles: [{ page: Number, article: Schema.Types.ObjectId }],
   challenges: [{ page: Number, challenge: Schema.Types.ObjectId  }],
   users: [Schema.Types.ObjectId ]
  
});

ModuleSchema.methods.is_registered = function(user)
{
	if(!this.users.length)
		return false;

	for(let i in this.users)
	{
		if(this.users[i].equals(user))
			return true;
	}
	return false;
}

module.exports = mongoose.model('Module', ModuleSchema);