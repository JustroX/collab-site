var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user.js');
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

   Modules
   - add edit  delete
   0    0   0       0
   1    1   0       0
   2    0   1       0
   3    1   1       0
   4    0   0       1
   5    1   0       1
   6    0   1       1
   7    1   1       1



*/


var GuildSchema = mongoose.Schema({
	
   name: String,
   description: String,
   ranks: [ 
   			{ 
   				name : String,
               description: String,
   				permission_settings : Number,
   				permission_members  : Number,
               permission_posts    : Number,
               permission_modules    : Number,
   			} ],

   users: [ { user:{ type: Schema.Types.ObjectId, ref : "User"} , ranks: [] } ],
   users_pending : [ { user: { type: Schema.Types.ObjectId, ref: "User"} , message: String } ],
   modules: [Schema.Types.ObjectId],
   posts: [Schema.Types.ObjectId],
   badges_required: [Schema.Types.ObjectId],

   created_by : { type: Schema.Types.ObjectId, ref: "User"}
  
});

GuildSchema.methods.is_permitted = function(user,permission,num)
{
   let find = false;
   for(let i in this.users)
   {
      let cur = this.users[i];
      if( cur.user==user )
      {
         for(let x in this.ranks)
         {
            for(let y in cur.ranks)
            {
               if(this.ranks[x].name == cur.ranks[y])
               {
                  // console.log(cur.user+" "+user);
                  if( this.ranks[x][permission] & num )
                     find = true
               }
            }
         }
      }
   }
   return find;
}

GuildSchema.methods.is_badge_complete = function(user_id)
{
   User.findById(user_id,function(err,user)
   {
      for(let j in this.badges_required)
      {
         let found = false;
         for(let i in user.badges)
         {
            if(this.badges_required[j]==user.badges[i])
            {
               found = true;
               break;
            }
         }
         if(!found)
            return false;
      }
      return true;
   });
}

GuildSchema.methods.is_member = function(user)
{

   for(let i in this.users)
   {
      let cur = this.users[i];
      if( cur.user==user )
         return true;
   }
   return false;
}

GuildSchema.methods.is_permitted_module = function(user,num)
{
   let permited = false;
   let guild = this;
   for( let i in guild.users )
   {

      if( typeof guild.users[i] == "object" &&  guild.users[i].user && guild.users[i].user.equals(user))
      {
         let done = false
         for(let j in guild.ranks)
         {
            for(let k in guild.users[i].ranks)
            {
               if(guild.users[i].ranks[k] == guild.ranks[j].name)
               {
                  let permission_modules =  guild.ranks[j].permission_modules;
                  permited = permission_modules & num
                  done = true;
                  break;
               }
            }
            if(done)
               break

         }

         break;
      }
   }
   return permited;
}

module.exports = mongoose.model('Guild', GuildSchema);