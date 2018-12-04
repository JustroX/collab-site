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

module.exports = mongoose.model('Module', ModuleSchema);