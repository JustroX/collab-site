var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var PostSchema = mongoose.Schema({
	
   content: String,
   group : Schema.Types.Mixed,
   
   liked_by  : [ Schema.Types.ObjectId ],
   shared_by : [{ user:  Schema.Types.ObjectId , group: Schema.Types.ObjectId  }],
   replies   : [ Schema.Types.ObjectId ],
   author    : Schema.Types.ObjectId
  
});

PostSchema.methods.validateInputs = function()
{
	return this.name && this.birthday && 
		(
			( this.private.local.email && this.private.local.password  )
		) 
}

module.exports = mongoose.model('Post', PostSchema);