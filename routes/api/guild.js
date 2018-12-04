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
		if(err) throw err;
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
	Guild.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/:id', function(req, res){
	let guild_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Guild.findById(guild_id,fields.join(' ') ,function(err,guild)
	{
		if(!guild) return res.send({ code: 500 , message: 'Guild not found.' });
		res.send(guild);
	});
});


router.put('/:id', lib.logged , function(req, res){

	let user   = req.session.passport.user;




	let guild_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Guild.findById(guild_id, function(err, guild)
	{
		if(err) throw err;	

		if(!guild) return res.send({ code: 500 , message: 'Guild not found.' });

		let find = false;
		for(let i in guild.ranks)
		{
			let cur = guild.ranks[i];
			if( cur.user==user && (cur.permission_settings & 1) )
			{
				find = true
			}
		}
		if(!find) return res.send({ code: 403, message: "Permission Denied"});

		for(let i in query)
		{
			guild[i] = query[i];
		}
		guild.save(function(err, updatedUser)
		{
			if(err) throw err;

			let output = lib.hide_fields(updatedUser,PERMISSIONS);

			res.send(output);
		});
	});
});


router.delete('/:id', function(req, res){
	let guild_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, message: 'Please login to continue'});
	

	Guild.findById(guild_id, function(err, guild)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!guild) return res.send({ code: 500 , message: 'Guild not found.' });
		let find = false;
		for(let i in guild.ranks)
		{
			let cur = guild.ranks[i];
			if( cur.user==user && (cur.permission_settings & 2) )
			{
				find = true
			}
		}
		if(!find) return res.send({ code: 403, message: "Permission Denied"});
		
		Guild.deleteOne({ _id: guild_id },function(err)
		{
			if(err) return res.send({ err : "Databasse Error" });
			return res.send({ message: "Delete successful" })

		});
	});
});

module.exports = router;