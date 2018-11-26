var router = require('express').Router();
var User = require('../../models/user.js');

router.get('/', function(req, res){
	User.find({},'-private -__v',function(err,docs)
	{
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
	user.name     = body.name;
	user.bio 	  = body.bio;
	user.birthday = body.birthday;
	user.school   = body.school;
	user.privileges = body.privileges;

	//save stuff
	if(body.private.local)
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