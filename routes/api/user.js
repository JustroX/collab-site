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
		if(err) throw err;
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
		if(err) throw err;

		for(let i in query)
		{
			user[i] = query[i];
		}
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
			return res.send({ success: "Delete successful" })
	})
});

module.exports = router;