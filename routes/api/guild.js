var router = require('express').Router();
var Guild = require('../../models/guild.js');
var parser = require('./parse_params.js');

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
   name: 7,
   description: 7,
   ranks: 5,

   users: 1,
   modules: 1,
   posts: 1,
   badges_required: 1,

   created_by : 3
}

router.post('/', function(req, res){

	/*
		authenticate via passport
		check if legit rank
	*/

	let body = req.body;

	let complete = true;
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			complete &= body[i] != null
		}
	}

	if(!complete)
		return res.send({ code: 400, err: "Invalid request." });

	let guild = new Guild();
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			guild[i] = body[i];
		}
	}
	

	guild.save(function(err)
	{
		if(err) throw err;
		let output = parser.hide_fields(guild,PERMISSIONS);
		return res.send({ guild : output });
	});


});

router.get('/', function(req, res){

	let fields = parser.fields(req,PERMISSIONS);
	let sort = parser.sort(req,PERMISSIONS);
	let query = parser.filter(req,PERMISSIONS);
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
	let fields = parser.fields(req,PERMISSIONS);
	let sort = parser.sort(req,PERMISSIONS);
	let options = req.query.option;

	Guild.findById(guild_id,fields.join(' ') ,function(err,guild)
	{
		res.send(guild);
	});
});


router.put('/:id', function(req, res){
	let guild_id = req.params.id;
	let query = parser.sanitize(req,PERMISSIONS);

	Guild.findById(guild_id, function(err, guild)
	{
		if(err) throw err;

		for(let i in query)
		{
			guild[i] = query[i];
		}
		guild.save(function(err, updatedUser)
		{
			if(err) throw err;

			let output = parser.hide_fields(updatedUser,PERMISSIONS);

			res.send(output);
		});
	});

});


router.delete('/:id', function(req, res){
	let guild_id = req.params.id;
	Guild.deleteOne({ _id: guild_id },function(err)
	{
		if(err) return res.send({ err : "Unknown Error" });
		else
			return res.send({ success: "Delete successful" })
	})
});

module.exports = router;