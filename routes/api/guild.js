var router = require('express').Router();
var Guild = require('../../models/guild.js');
var lib = require('./api-helper.js');

/*
	In group permissions
	
	Settings 
	- edit
	- delete

	Members
	- add
	- edit
	- delete
	Posts
	- remove

*/


var PERMISSIONS = 
{	
   _id : 1,
   name: 7,
   description: 7,
   ranks: 5,

   users: 1,
   "users.ranks" : 1,
   "users.user" : 1,

   modules: 1,
   posts: 1,
   badges_required: 1,

   created_by : 1
}

router.post('/', lib.logged,  function(req, res){

	let body = req.body;
	
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	let guild = new Guild();
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			guild[i] = body[i];
		}
	}
	guild.created_by = req.session.passport.user ;
	guild.ranks = [ { name: "admin"  , 
   				permission_settings : 3,
   				permission_members  : 7,
   				permission_posts    : 1,
   				permission_modules    : 7 } ];
   	guild.users = [ { user: req.session.passport.user, ranks: ["admin"] } ] 


	guild.save(function(err)
	{
		if(err) return res.send({code:500, err: "Database Error"})
		let output = lib.hide_fields(guild,PERMISSIONS);
		return res.send(output);
	});
});

router.get('/', function(req, res){

	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let query = lib.filter(req,PERMISSIONS);
	let options = req.query.option;


	let limit =  (req.query.limit || 10)-1+1;
	let offset = (req.query.offset || 0)-1+1;

	if(options)
	{
		let opt = {};
		Guild.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Guild.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset)
	.populate("users","name username private.local.email")
	.populate("created_by","name username private.local.email")
	.exec(function(err,docs)
	{
		if(err) return res.send({code:500, err: "Database Error"})
		res.send(docs);
	});
});

router.get('/:id', function(req, res){
	let guild_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Guild.find({ _id: guild_id},fields.join(' '))
	.populate("users.user","name username private.local.email")
	.populate("created_by","name username private.local.email")
	.exec(function(err,guild)
	{
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		res.send(guild[0]);
	});
});


//PENDINGs
router.get('/:id/users_pending', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.find({_id: guild_id}).populate('users_pending.user','name').exec(function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		guild = guild[0];
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });

		if(!guild.is_permitted(user,"permission_members",1)) return res.send({ code: 403, err: "Permission Denied"});

		res.send(guild.users_pending);
	});
});

router.post('/:id/users_pending/request', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.findById(guild_id,function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		if(guild.is_member(user)) return res.send({code:403, err: 'User is already a member'});

		for(let i in guild.users_pending)
		{
			if(guild.users_pending[i].user == user )
				return res.send({ code: 403, err: "You already have a pending request."});
		}

		guild.users_pending.push({ user: user ,  message: req.body.message});
		guild.save(function(err, updatedUser)
		{
			res.send({ message: "Done" , code: 200});
		});
	});
});


router.delete('/:id/users_pending/request/:pending_id', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.findById(guild_id,function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });

		for(let i in guild.users_pending)
		{
			if(guild.users_pending[i]._id && guild.users_pending[i]._id.equals(req.params.pending_id) )
			{
				guild.users_pending.splice(i,1);
				break;
			}		
		}
		guild.save(function(err, updatedUser)
		{
			res.send({ message: "Done" , code: 200});
		});
	});
});




//MEMBER

router.get('/:id/members/', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.find({ _id: guild_id}).populate('users.user','name').exec(function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild[0]) return res.send({ code: 500 , err: 'Guild not found.' });
		res.send( guild[0].users );
	});
});

router.post('/:id/members/', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.findById(guild_id,function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		let permitted = guild.is_permitted(user,"permission_members",1);
		
		if(!permitted && guild.is_member(user)) return res.send({code:403, err: 'User is already a member'});
		
		guild.is_badge_complete(user,function(badge_completed)
		{

			if(!badge_completed && !permitted)
			{
				return res.send({ code: 403, err: "Your are not allowed to perform this action."});
			}
			let target = permitted? req.body.user : user;
			if(guild.is_member(target)) return res.send({code:403, err: 'User is already a member'});
			guild.users.push({ user: target ,  ranks: [] });

			//remove from pending users
			for(let i in guild.users_pending)
			{
				if( guild.users_pending[i].user && guild.users_pending[i].user._id && guild.users_pending[i].user._id.equals(target)  )
				{
					guild.users_pending.splice(i,1);
					break;
				}
			}

			guild.save(function(err, updatedUser)
			{
				res.send({ message: "Done" , code: 200});
			});
		});
	});
});

router.put('/:id/members/:mem_id', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.findById(guild_id,function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		
		if(!guild.is_permitted(user,"permission_members",2))
			return res.send({code: 403, err: "Permission Denied"});
		if(!guild.is_member(user)) return res.send({code:403, err: 'User is not a member'});

		for(let i in guild.users)
		{
			if(guild.users[i]._id == req.params.mem_id)
			{
				if(guild.is_permitted(guild.users[i].user,"permission_members",2))
				{
					let count = 0;
					for(let u in guild.users)
					{
						count += guild.is_permitted(guild.users[u].user,"permission_members",2);		
					}
					if(count == 1 && !guild.rank_permission(req.body.rank,"permission_members",2))
						return res.send({code: 403, err: "Can't modify the only user with update privileges."});
				}
				guild.users[i].ranks = [req.body.rank];
			}
		}

		guild.save(function(err, updatedUser)
		{
			res.send({ message: "Done" , code: 200});
		});
	});
});

router.delete('/:id/members/:mem_id', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let guild_id = req.params.id;

	Guild.findById(guild_id,function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		
		if(!guild.is_permitted(user,"permission_members",4))
			return res.send({code: 403, err: "Permission Denied"});
		if(!guild.is_member(user)) return res.send({code:403, err: 'User is not a member'});


		for(let i in guild.users)
		{
			if(guild.users[i]._id == req.params.mem_id)
			{
				if(guild.is_permitted(guild.users[i].user,"permission_members",2))
				{
					let count = 0;
					for(let u in guild.users)
					{
						count += guild.is_permitted(guild.users[u].user,"permission_members",2);		
					}
					if(count == 1)
						return res.send({code: 403, err: "Can't delete the only user with update privileges."});
				}
				guild.users.splice(i,1);
				break;
			}
		}

		guild.save(function(err, updatedUser)
		{
			res.send({ message: "Done" , code: 200});
		});
	});
});




//RANKS


router.put('/:id', lib.logged , function(req, res){

	let user   = req.session.passport.user;
	let guild_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Guild.findById(guild_id, function(err, guild)
	{
		if(err) return res.send({code:500, err: "Database Error"})	

		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });

		let find = false;
		for(let i in guild.users)
		{
			let cur = guild.users[i];
			if( cur.user==user )
			{
				for(let x in guild.ranks)
				{
					for(let y in cur.ranks)
					{
						if(guild.ranks[x].name == cur.ranks[y])
						{
							// console.log(cur.user+" "+user);
							if( guild.ranks[x].permission_settings & 1 )
								find = true
						}
					}
				}
			}
		}
		if(!find) return res.send({ code: 403, err: "Permission Denied"});

		for(let i in query)
		{
			guild[i] = query[i];
		}
		guild.save(function(err, updatedUser)
		{
			if(err) return res.send({code:500, err: "Database Error"})

			let output = lib.hide_fields(updatedUser,PERMISSIONS);

			res.send(output);
		});
	});
});


router.delete('/:id', function(req, res){
	let guild_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, err: 'Please login to continue'});
	

	Guild.findById(guild_id, function(err, guild)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!guild) return res.send({ code: 500 , err: 'Guild not found.' });
		let find = false;
		for(let i in guild.users)
		{
			let cur = guild.users[i];
			if( cur.user==user )
			{
				for(let x in guild.ranks)
				{
					for(let y in cur.ranks)
					{
						if(guild.ranks[x].name == cur.ranks[y])
						{
							// console.log(cur.user+" "+user);
							if( guild.ranks[x].permission_settings & 2 )
								find = true
						}
					}
				}
			}
		}
		if(!find) return res.send({ code: 403, err: "Permission Denied"});
		
		Guild.deleteOne({ _id: guild_id },function(err)
		{
			if(err) return res.send({ err : "Databasse Error" });
			return res.send({ message: "Delete successful" })

		});
	});
});

module.exports = router;