var router = require('express').Router();
var Post = require('../../models/model_divider.js').model("Post");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, function(req,res,next)
{
	req.body.group = req.body.group  || "$n_null";
	req.body.parent = req.body.parent || "$n_null";
	next();
},
api.post(Post,function(req,res,model)
{
	if(req.body.group == "self")
	{
		model.set("group",undefined);
		model.set("wall",true);
	}

	if(req.body.parent)
		model.set("parent",req.body.parent);

	model.set("date",new Date());
	model.set("author",req.session.passport.user);
	

	return model;
}));
router.get('/', api.logged, api.list(Post) );
router.get('/:id',api.logged, api.get(Post));
router.put('/:id',api.logged,api.put(Post, null, function(req,res,post)
	{
		if(!post.author.equals(req.session.passport.user))
		{
			res.send({ code: 403, err: "Permission Denied." });
			return false;
		}
		return true;
	}
));
router.delete('/:id',api.logged,api.delete(Post));


//liked_by
router.get('/:id/liked_by/', api.list_endpoint(Post , "liked_by"));
router.post('/:id/liked_by/', api.logged, function(req,res,next)
{
	req.body.user = req.session.passport.user;
	next();
}  , api.post_endpoint(Post , "liked_by"));
router.get('/:id/liked_by/:field_id', api.get_endpoint(Post , "liked_by"));
router.put('/:id/liked_by/:field_id', api.put_endpoint(Post , "liked_by"));
router.delete('/:id/liked_by/:field_id', api.logged, api.delete_endpoint(Post , "liked_by"));

//shared_by
router.get('/:id/shared_by/', api.list_endpoint(Post , "shared_by"));
router.post('/:id/shared_by/', api.logged , function(req,res,next)
{
	req.body.user = req.session.passport.user;
	next();
}, api.post_endpoint(Post , "shared_by"));
router.get('/:id/shared_by/:field_id', api.get_endpoint(Post , "shared_by"));
router.put('/:id/shared_by/:field_id', api.put_endpoint(Post , "shared_by"));
router.delete('/:id/shared_by/:field_id', api.logged, api.delete_endpoint(Post , "shared_by"));

module.exports = router;