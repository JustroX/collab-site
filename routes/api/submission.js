var router = require('express').Router();
var lib = require('./api-helper.js')
var Submission = require('../../models/submission.js');
var Challenge = require('../../models/challenge.js');
var Module = require('../../models/module.js');


var PERMISSIONS  = 
{	
	_id: 1,
	content : 3,
   	challenge: 3,
   	language: 3,
   	author : 1,
   	verdict: 1,  
}


router.post('/', lib.logged,  function(req, res){

	if(! lib.validate_fields(req,res,PERMISSIONS)) return;
	
	Challenge.findById(req.body.challenge, function(err,challenge)
	{
		if(err) return res.send({ err: "Module not found", code: 500});
		if(!challenge) return res.send({ code: 500 , err: 'Challenge not found.' });

		Module.findById(challenge.module, function(err,mod)
		{
			if(err) return res.send({ err: "Module not found", code: 500});
			if(!mod) return res.send({ code: 500 , err: 'Module not found.' });

			// if(!mod.is_registered(req.session.passport.user))
			// 	return res.send({code: 403, err: 'You are not registered in this module.'})
			
			let submission = new Submission();
			for(let i in PERMISSIONS)
			{
				if(PERMISSIONS[i]&2)
				{
					submission[i] = req.body[i];
				}
			}
			submission.author = req.session.passport.user
			submission.get_verdict(res,challenge,function(results)
			{
				submission.verdict.testcases = results;
				submission.save(function(err)
				{
					if(err) return res.send({ err: "Database error", code: 500});
					let output = lib.hide_fields(submission,PERMISSIONS);
					return res.send(output);
				});
			});

		});
	});

});

router.get('/', lib.logged, function(req, res){

	req.query.author = req.session.passport.user;
	
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let query = lib.filter(req,PERMISSIONS);
	let options = req.query.option;

	let limit =  (req.query.limit || 10)-1+1;
	let offset = (req.query.offset || 0)-1+1;

	if(options)
	{
		let opt = {};
		Submission.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Submission.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) return res.send({ err: "Module not found", code: 500});
		res.send(docs);
	});
});

router.get('/:id', function(req, res){
	
	let submission_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Submission.findById(submission_id,fields.join(' ') ,function(err,post)
	{
		if(!post) return res.send({ code: 500 , err: 'Submission not found.' });
		res.send(post);
	});
});

// router.put('/:id', function(req, res){

// });

// router.delete('/:id', function(req, res){

// });

module.exports = router;