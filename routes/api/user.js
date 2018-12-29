var router = require('express').Router();
var User = require('../../models/user.js');
var lib = require('./api-helper.js');


var PERMISSIONS = 
{
   _id: 1, 
   name: 7,
   bio: 7,
   birthday: 7,
   school: 7,
   privileges : 1,
   "private.local.email": 1,
   private: 0,
   username: 7,

   guilds : 1,

   posts: 1,
   likes: 1,
   shares: 1,

   modules: 1,
   articles: 1,
   submissions: 1,

   badges: 1,
   follows: 1,
   followed_by : 1,

};


router.get('/', function(req, res){

	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let query = lib.filter(req,PERMISSIONS);
	let options = req.query.option;

	let limit =  (req.query.limit || 10)-1+1;
	let offset = (req.query.offset || 0)-1+1;

	if(fields.includes("-private"))
		fields = ["_id","name","bio","birthday","school","private.local.email","guilds","posts","likes","shares","badges","follows","followed_by","username"]

	if(options)
	{
		let opt = {};
		User.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	User.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
	{
		if(err) return res.send({ err: "Database Error" , code: 500 });
		res.send(docs);
	});
});

router.get('/self', lib.logged ,function(req, res){
	let user_id = req.session.passport.user;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	User.findById(user_id,fields.join(' ') ,function(err,user)
	{
		res.send(user);
	});
});



router.get('/:id', function(req, res){
	let user_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	if(fields.includes("-private"))
		fields = ["_id","name","bio","birthday","school","private.local.email","guilds","posts","likes","shares","badges","follows","followed_by","username"]

	User.findById(user_id,fields.join(' ') ,function(err,user)
	{
		res.send(user);
	});
});










router.post('/', lib.logged, lib.admin_user(1) , function(req, res){

	//auntenticate admin settings
	

	var body = req.body;
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;
	
	var user = new User();

	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			user[i] = req.body[i];
		}
	}

	//save stuff
	if(body.private && body.private.local)
	{
		user.private.local = body.private.local;
		user.private.local.password = user.generateHash(user.private.local.password);
	}
	

	if(user.validateInputs())
	{
		user.save(function(err)
		{
			if(err) throw err;
			return res.send({ user: user});
		});
	}
	else
		res.send({ code: 400, err: 'Invalid request.'});
});

router.put('/:id', lib.logged, lib.admin_user(2), function(req, res){
	let user_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	User.findById(user_id, function(err, user)
	{
		if(err) return res.send({ err: "Database Error" , code: 500 });

		for(let i in query)
		{
			user[i] = query[i];
		}
		if(req.body.private && req.body.private.local && req.body.private.local.password)
			user.private.local.password = user.generateHash(req.body.private.local.password);
		if(req.body.private && req.body.private.local && req.body.private.local.email)
			user.private.local.email = req.body.private.local.email;

		user.save(function(err, updatedUser)
		{
			if(err) throw err;

			let output = lib.hide_fields(updatedUser,PERMISSIONS);

			res.send(output);
		});
	});
});

router.delete('/:id', lib.logged,  lib.admin_user(4), function(req, res){
	let user_id = req.params.id;
	User.deleteOne({ _id: user_id },function(err)
	{
		if(err) return res.send({ err : "Unknown Error" });
		else
			return res.send({ message: "Delete successful" })
	})
});

module.exports = router;