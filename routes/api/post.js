var router = require('express').Router();
var lib = require('./api-helper.js')
var Post = require('../../models/post.js');

var PERMISSIONS  = 
{	
   _id: 1,
   content: 7,
   group : 3,
   
   liked_by  : 1,
   shared_by : 1,
   replies   : 1,
   author    : 1
  
}

router.post('/', lib.logged , function(req, res){

	if(! lib.validate_fields(req,res,PERMISSIONS)) return;


	let post = new Post();
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			post[i] = req.body[i];
		}
	}
	post.author = req.session.passport.user
	post.save(function(err)
	{
		if(err) throw err;
		let output = lib.hide_fields(post,PERMISSIONS);
		return res.send(output);
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
		Post.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Post.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).exec(function(err,docs)
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

	Post.findById(post_id,fields.join(' ') ,function(err,post)
	{
		if(!post) return res.send({ code: 500 , message: 'Post not found.' });
		res.send(post);
	});

});


router.put('/:id', lib.logged, function(req, res){

	let user   = req.session.passport.user;
	let post_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Post.findById(post_id, function(err, post)
	{
		if(err) throw err;	
		if(!post) return res.send({ code: 500 , message: 'Post not found.' });

		for(let i in query)
		{
			post[i] = query[i];
		}
		post.save(function(err, updatedUser)
		{
			if(err) throw err;
			let output = lib.hide_fields(updatedUser,PERMISSIONS);
			res.send(output);
		});
	});
});

router.delete('/:id', lib.logged , function(req, res){
	let post_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, message: 'Please login to continue'});
	

	Post.findById(post_id, function(err, post)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!post) return res.send({ code: 500 , message: 'Post not found.' });
				
		Post.deleteOne({ _id: post_id },function(err)
		{
			if(err) return res.send({ err : "Databasse Error" });
			return res.send({ message: "Delete successful" })

		});
	});
});

module.exports = router;