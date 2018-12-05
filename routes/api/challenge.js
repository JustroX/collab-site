var router = require('express').Router();
var lib = require('./api-helper.js');
var Challenge = require('../../models/challenge.js');
var Module = require('../../models/module.js');
var Guild = require('../../models/guild.js');


var PERMISSIONS  = 
{
	_id: 1,
	title: 7,
	content: 7,
	testcases: 0,
	module: 3,
	authors: 1,
  
}

router.post('/', lib.logged, function(req, res){
	let body = req.body;
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	Module.findById(body.module,function(err, mod)
	{
		if(err) throw err;
		if(!mod) return res.send({ code: 501, err:"Module not found." });

		Guild.findById(mod.guild, function(err, guild){

			if(err) throw err;
			if(!guild) return res.send({ code: 501, err: "Guild not found." });

			let permited = guild.is_permitted_module(req.session.passport.user,2);
			if(!permited) return res.send({ code: 403, err: "Permission Denied" })

			let challenge = new Challenge();
			for(let i in PERMISSIONS)
			{
				if(PERMISSIONS[i]&2)
				{
					challenge[i] = req.body[i];
				}
			}
			challenge.authors = [req.session.passport.user];

			challenge.save(function(err)
			{
				if(err) throw err;
				let output = lib.hide_fields(challenge,PERMISSIONS);
				return res.send(output);
			});
		});
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
		Challenge.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Challenge.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});

});

router.get('/:id', function(req, res){
	let challenge_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Challenge.findById(challenge_id,fields.join(' ') ,function(err,mod)
	{
		if(!mod) return res.send({ code: 500 , message: 'Challenge not found.' });
		res.send(mod);
	});
});

router.put('/:id', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let challenge_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Challenge.findById(challenge_id,function(err,challenge)
	{
		if(err) throw err;	
		if(!challenge) return res.send({ code: 500 , message: 'Challenge not found.' });

		Module.findById(challenge.module,function(err, mod)
		{
			if(err) throw err;
			if(!mod) return res.send({ code: 501, err:"Module not found." });

			Guild.findById(mod.guild, function(err, guild){

				if(err) throw err;
				if(!guild) return res.send({ code: 501, err: "Guild not found." });

				let permited = guild.is_permitted_module(req.session.passport.user,2);
				if(!permited) return res.send({ code: 403, err: "Permission Denied" })

				for(let i in query)
				{
					challenge[i] = query[i];
				}

				let found = false;
				for(let i in challenge.authors)
				{
					if(challenge.authors[i].equals(user))
					{
						found = true;
						break;
					}
				}

				if(!found)
					challenge.authors.push(user)

				challenge.save(function(err, updated)
				{
					if(err) throw err;
					let output = lib.hide_fields(updated,PERMISSIONS);
					res.send(output);
				});
			});
		});

	});
});

router.delete('/:id', lib.logged, function(req, res){
	let challenge_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, message: 'Please login to continue'});
	


	Challenge.findById(challenge_id, function(err, challenge)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!challenge) return res.send({ code: 500 , message: 'Challenge not found.' });

		Module.findById(challenge.module,function(err, mod)
		{
			if(err) throw err;
			if(!mod) return res.send({ code: 501, err:"Module not found." });
	
			Guild.findById(mod.guild, function(err, guild){

				if(err) throw err;
				if(!guild) return res.send({ code: 501, err: "Guild not found." });

				let permited = guild.is_permitted_module(user,4);
				if(!permited) return res.send({ code: 403, err: "Permission Denied" })

				Challenge.deleteOne({ _id: challenge_id },function(err)
				{
					if(err) return res.send({ err : "Databasse Error" });
					return res.send({ message: "Delete successful" })

				});
			});
		});
	});
});

module.exports = router;