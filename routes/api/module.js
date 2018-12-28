var router = require('express').Router();
var lib = require('./api-helper.js')
var Module = require('../../models/module.js');
var Guild = require('../../models/guild.js');

var PERMISSIONS  = 
{
	_id: 1,
	name: 7, 
	guild: 3,
	badges: 5,
	articles: 5,
	challenges:5,
	users: 1
  
}

router.post('/',  lib.logged , function(req, res){
	
	let body = req.body;
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	Guild.findById(body.guild, function(err, guild){

		if(err) throw err;
		if(!guild) return res.send({ code: 501, err: "Guild not found." });

		let permited = guild.is_permitted_module(req.session.passport.user,1);
		if(!permited) return res.send({ code: 403, err: "Permission Denied" })

		let mod = new Module();
		for(let i in PERMISSIONS)
		{
			if(PERMISSIONS[i]&2)
			{
				mod[i] = req.body[i];
			}
		}

		mod.save(function(err)
		{
			if(err) throw err;
			let output = lib.hide_fields(mod,PERMISSIONS);
			return res.send(output);
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
		Module.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Module.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset)
	.populate("users","name username private.local.email")
	.exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});

});

router.get('/:id', function(req, res){
	let mod_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Module.find({ _id: mod_id},fields.join(' '))
	.populate("users","name username private.local.email")
	.exec(function(err,mod)
	{
		if(!mod[0]) return res.send({ code: 500 , err: 'Module not found.' });
		res.send(mod[0]);
	});

});

router.put('/:id', lib.logged, function(req, res){

	let user   = req.session.passport.user;
	let mod_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Module.findById(mod_id, function(err, mod)
	{
		if(err) throw err;	
		if(!mod) return res.send({ code: 500 , err: 'Module not found.' });
	
		Guild.findById(mod.guild, function(err, guild){

			if(err) throw err;
			if(!guild) return res.send({ code: 501, err: "Guild not found." });

			let permited = guild.is_permitted_module(user,2);
			if(!permited) return res.send({ code: 403, err: "Permission Denied" })

			for(let i in query)
			{
				mod[i] = query[i];
			}
			mod.save(function(err, updated)
			{
				if(err) throw err;
				let output = lib.hide_fields(updated,PERMISSIONS);
				res.send(output);
			});
		});
	});

});

router.delete('/:id', lib.logged, function(req, res){
	let mod_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, err: 'Please login to continue'});
	

	Module.findById(mod_id, function(err, mod)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!mod) return res.send({ code: 500 , err: 'Module not found.' });

		Guild.findById(mod.guild, function(err, guild){

			if(err) throw err;
			if(!guild) return res.send({ code: 501, err: "Guild not found." });

			let permited = guild.is_permitted_module(user,4);
			if(!permited) return res.send({ code: 403, err: "Permission Denied" })

			Module.deleteOne({ _id: mod_id },function(err)
			{
				if(err) return res.send({ err : "Databasse Error" });
				return res.send({ err: "Delete successful" })

			});
		});

	});
});

module.exports = router;