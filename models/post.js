var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var PostSchema = mongoose.Schema({
	
   content: String,
   group : { type: Schema.Types.ObjectId, ref: 'Guild'},
   date : Date,
   
   liked_by  : [  { type: Schema.Types.ObjectId, ref: 'User'} ],
   shared_by : [{ user:   { type: Schema.Types.ObjectId, ref: 'User'} , group:  { type: Schema.Types.ObjectId, ref: 'User'}  }],
   replies   : [  { type: Schema.Types.ObjectId, ref: 'Post'} ],
   author    : { type: Schema.Types.ObjectId, ref: 'User'}
  
});

PostSchema.methods.validateInputs = function()
{
	return this.name && this.birthday && 
		(
			( this.private.local.email && this.private.local.password  )
		) 
}

module.exports = mongoose.model('Post', PostSchema);