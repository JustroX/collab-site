var router  = require('express').Router();
var lib     = require('./api-helper.js')
var Badge = require('../../models/badge.js');
var User = require('../../models/user.js');

var PERMISSIONS  = 
{	
	_id: 1,
	name: 7,
	asset: 5,
	created_by: 1
}

router.post('/', lib.logged , function(req, res){
	let body = req.body;
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	User.findById(req.session.passport.user, function(err,user)
	{
		if(err) throw err;

		if(!(user.badge_permission & 1)) return res.send({ code: 403, message: "Permission Denied."})

		let badge = new Badge();
		for(let i in PERMISSIONS)
		{
			if(PERMISSIONS[i]&2)
			{
				badge[i] = req.body[i];
			}
		}
		badge.created_by = req.session.passport.user
		badge.save(function(err)
		{
			if(err) throw err;
			let output = lib.hide_fields(badge,PERMISSIONS);
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
		Badge.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Badge.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/:id', function(req, res){

	let post_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Badge.findById(post_id,fields.join(' ') ,function(err,badge)
	{
		if(!badge) return res.send({ code: 500 , message: 'Badge not found.' });
		res.send(badge);
	});

});


router.put('/:id', lib.logged , function(req, res){
	let user   = req.session.passport.user;
	let badge_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	User.findById(req.session.passport.user, function(err,user)
	{
		if(err) throw err;

		if(!(user.badge_permission & 2)) return res.send({ code: 403, message: "Permission Denied."})
		Badge.findById(badge_id, function(err, badge)
		{
			if(err) throw err;	
			if(!badge) return res.send({ code: 500 , message: 'Badge not found.' });

			for(let i in query)
			{
				badge[i] = query[i];
			}
			badge.save(function(err, updatedUser)
			{
				if(err) throw err;
				let output = lib.hide_fields(updatedUser,PERMISSIONS);
				res.send(output);
			});
		});
	});
});

router.delete('/:id', lib.logged , function(req, res){
	let badge_id = req.params.id;
	let user   = req.session.passport.user;

	User.findById(req.session.passport.user, function(err,user)
	{
		if(err) throw err;

		if(!(user.badge_permission & 4)) return res.send({ code: 403, message: "Permission Denied."})
		Badge.findById(badge_id, function(err, badge)
		{
			if(err) return res.send({ err : "Databasse Error" });
			if(!badge) return res.send({ code: 500 , message: 'Badge not found.' });
					
			Badge.deleteOne({ _id: badge_id },function(err)
			{
				if(err) return res.send({ err : "Databasse Error" });
				return res.send({ message: "Delete successful" })

			});
		});
	});
});

module.exports = router;