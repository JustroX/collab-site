var router = require('express').Router();
var Post = require('../../models/model_divider.js').model("Post");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Post,function(req,res,model)
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
router.get('/', api.list(Post) );
router.get('/:id', api.get(Post));
router.put('/:id', api.put(Post));
router.delete('/:id', api.delete(Post));


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

//replies
router.get('/:id/replies/', api.list_endpoint(Post , "replies"));
router.post('/:id/replies/', api.post_endpoint(Post , "replies"));
router.get('/:id/replies/:field_id', api.get_endpoint(Post , "replies"));
router.put('/:id/replies/:field_id', api.put_endpoint(Post , "replies"));
router.delete('/:id/replies/:field_id', api.delete_endpoint(Post , "replies"));

module.exports = router;