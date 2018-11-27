var router = require('express').Router();
var User = require('../../models/user.js');
var parser = require('./parse_params.js');


var PERMISSIONS = 
{
   _id: 1, 
   name: 7,
   bio: 7,
   birthday: 7,
   school: 7,
   privileges : 1,
   private: 0,

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

	let fields = parser.fields(req,PERMISSIONS);
	let sort = parser.sort(req,PERMISSIONS);
	let query = parser.filter(req,PERMISSIONS);
	let options = req.query.option;

	User.find(query,fields.join(' '),function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/:id', function(req, res){
	let user = req.params.id;
	User.findById(user,'-private -__v ' ,function(err,user)
	{
		res.send(user);
	});
});

router.post('/', function(req, res){
	var body = req.body;
	var user = new User();

	//sanitize
	user.name     	= body.name;
	user.bio 	  	= body.bio;
	user.birthday 	= body.birthday;
	user.school   	= body.school;
	user.privileges = body.privileges;

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
		res.send({ code: 400, err: 'JSON syntax is wrong.'});


});

router.put('/', function(req, res){

});

router.post('/', function(req, res){

});

module.exports = router;