var router  = require('express').Router();
var lib     = require('./api-helper.js')
var Article = require('../../models/article.js');
var Module  = require('../../models/module.js');
var Guild   = require('../../models/guild.js');

var PERMISSIONS  = 
{	
	_id: 1,
	title: 7,
	content: 7,
	authors: 1,
	module: 3
}


router.post('/', lib.logged ,function(req, res){
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

			let article = new Article();
			for(let i in PERMISSIONS)
			{
				if(PERMISSIONS[i]&2)
				{
					article[i] = req.body[i];
				}
			}
			article.authors = [req.session.passport.user];

			article.save(function(err)
			{
				if(err) throw err;
				let output = lib.hide_fields(article,PERMISSIONS);
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
		Article.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Article.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});

});

router.get('/:id', function(req, res){
	let article_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Article.findById(article_id,fields.join(' ') ,function(err,mod)
	{
		if(!mod) return res.send({ code: 500 , message: 'Article not found.' });
		res.send(mod);
	});

});

router.put('/:id', lib.logged, function(req, res){
	let user   = req.session.passport.user;
	let article_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Article.findById(article_id,function(err,article)
	{
		if(err) throw err;	
		if(!article) return res.send({ code: 500 , message: 'Article not found.' });

		Module.findById(article.module,function(err, mod)
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
					article[i] = query[i];
				}

				let found = false;
				for(let i in article.authors)
				{
					if(article.authors[i].equals(user))
					{
						found = true;
						break;
					}
				}

				if(!found)
					article.authors.push(user)

				article.save(function(err, updated)
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
	let article_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, message: 'Please login to continue'});
	


	Article.findById(article_id, function(err, article)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!article) return res.send({ code: 500 , message: 'Article not found.' });

		Module.findById(article.module,function(err, mod)
		{
			if(err) throw err;
			if(!mod) return res.send({ code: 501, err:"Module not found." });
	
			Guild.findById(mod.guild, function(err, guild){

				if(err) throw err;
				if(!guild) return res.send({ code: 501, err: "Guild not found." });

				let permited = guild.is_permitted_module(user,4);
				if(!permited) return res.send({ code: 403, err: "Permission Denied" })

				Article.deleteOne({ _id: article_id },function(err)
				{
					if(err) return res.send({ err : "Databasse Error" });
					return res.send({ message: "Delete successful" })

				});
			});
		});
	});

});



module.exports = router;