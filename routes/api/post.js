var router = require('express').Router();
var lib = require('./api-helper.js')
var Post = require('../../models/post.js');
var User = require('../../models/user.js');
var max = function(a,b){ return (a>b)? a : b; };

var PERMISSIONS  = 
{	
   _id: 1,
   content: 7,
   group : 3,
   date: 1,
   
   liked_by  : 1,
   shared_by : 1,
   replies   : 1,
   author    : 1,

   parent : 1,
  
}

router.post('/', lib.logged , function(req, res){

	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	console.log(req.body);

	let post = new Post();
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			post[i] = req.body[i];
		}
	}
	post.author = req.session.passport.user;
	post.date = new Date();

	if(req.body.parent)
		post.parent  = req.body.parent;
	
	post.save(function(err,post)
	{
		if(err) return res.send({ code: 500, err: 'Database Error' });
		let output = lib.hide_fields(post,PERMISSIONS);

		if(req.body.parent)
			Post.findById(req.body.parent,function(err, parent_post){
				if(err) return res.send({ err: "Databasse error" , code: 500 });
				if(!parent_post) return res.send({ err: "Parent post not found", code: 500});

				parent_post.replies.push(post._id);
				parent_post.save(function(err)
				{
					if(err) return res.send({ err: "Databasse error" , code: 500 });
					return res.send(output)
				});
			});
		else
		return res.send(output);
	});
});

router.get('/', lib.logged, function(req, res){

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
	Post.find(query,fields.join(' '))
		.sort(sort)
		.limit(limit).skip(max(0,limit*offset))
		.populate("group")
		.populate("liked_by","name username")
		.populate("shared_by","name username")
		.populate("replies")
		.populate("author","name username")	
		.populate("replies.author","name username")
		.populate("replies.liked_by","name username")
		.populate("replies.shared_by","name username")
	.exec(function(err,docs)
	{
		console.log(docs)
		if(err) return res.send({ code: 500, err: 'Database Error' });
		res.send(docs);
	});

});

router.get('/feed', lib.logged,  function(req, res){

	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let query = lib.filter(req,PERMISSIONS);
	let options = req.query.option;

	let limit =  (req.query.limit || 10)-1+1;
	let offset = (req.query.offset || 0)-1+1;



	User.findById(req.session.passport.user , function(err,u)
	{
		query["author"] = u.follows;
		query["author"].push(u._id);
		
		if(options)
		{
			let opt = {};
			Post.count(query,function(err,count)
			{
				opt.collectionCount = count;
				res.send(opt);
			});
		}
		else
		Post.find(query,fields.join(' '))
			.sort(sort)
			.limit(limit).skip(max(0,limit*offset))
			.populate("group")
			.populate("liked_by","name username")
			.populate("shared_by","name username")
			.populate("replies")
			.populate("author","name username")	
		.exec(function(err,docs)
		{
			if(err) return res.send({ code: 500, err: 'Database Error' });
			res.send(docs);
		});
	});



});


router.get('/:id', function(req, res){
	let post_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Post.find({_id: post_id},fields.join(' ')).populate("group")
		.populate("liked_by","name username")
		.populate("shared_by","name username")
		.populate("replies")
		.populate("author","name username").exec(function(err,post)
	{
		if(!post) return res.send({ code: 500 , err: 'Post not found.' });
		res.send(post[0] || post);
	});

});


router.put('/:id', lib.logged, function(req, res){


	let user   = req.session.passport.user;
	let post_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	Post.findById(post_id, function(err, post)
	{
		if(err) return res.send({ code: 500, err: 'Database Error' });	
		if(!post) return res.send({ code: 500 , err: 'Post not found.' });

		for(let i in query)
		{
			post[i] = query[i];
		}
		post.save(function(err, updatedUser)
		{
			if(err) return res.send({ code: 500, err: 'Database Error' });
			let output = lib.hide_fields(updatedUser,PERMISSIONS);
			res.send(output);
		});
	});
});

router.delete('/:id', lib.logged , function(req, res){
	let post_id = req.params.id;
	let user   = req.session.passport.user;
	if(!user) return res.send({ code: 403, err: 'Please login to continue'});
	

	Post.findById(post_id, function(err, post)
	{
		if(err) return res.send({ err : "Databasse Error" });
		if(!post) return res.send({ code: 500 , err: 'Post not found.' });
				
		Post.deleteOne({ _id: post_id },function(err)
		{
			if(err) return res.send({ code: 500, err : "Databasse Error" });
			return res.send({ message: "Delete successful" })

		});
	});
});

module.exports = router;