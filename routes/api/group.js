var router = require('express').Router();
var Group = require('../../models/model_divider.js').model("Group");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Group ,function(req,res,model)
{
	model.ranks.push({ name: "admin", permissions: {
		group: 15,
		users: 15,
		module: 15,
		post: 15,
	}, default: false  });
	model.ranks.push({ name: "member", permissions: 
	{
		group: 1,
		users: 0,
		module: 0,
		post: 0,		
	}, default: true   });
	model.users.push({ user: req.session.passport.user, rank: model.ranks[0]._id});
	return model;
}));
router.get('/', api.list(Group) );
router.get('/:id', api.get(Group));
router.put('/:id', api.put(Group));
router.delete('/:id', api.delete(Group));


//ranks
router.get('/:id/ranks/', api.list_endpoint(Group , "ranks"));
router.post('/:id/ranks/', api.post_endpoint(Group , "ranks"));
router.get('/:id/ranks/:field_id', api.get_endpoint(Group , "ranks"));
router.put('/:id/ranks/:field_id', api.put_endpoint(Group , "ranks"));
router.delete('/:id/ranks/:field_id', api.delete_endpoint(Group , "ranks"));

//users
router.get('/:id/users/', api.list_endpoint(Group , "users"));
router.post('/:id/users/', api.post_endpoint(Group , "users" ,
function(req,res,model)
{
	if(!model.is_authorized(req,res,"users",2)) return;
	return model;
},
function(req,res,model)
{

	let count = 0;
	for(let i in model.toObject().users)
	{
		let obj = model.users[i];
		if(obj.user._id.equals(req.body.user))
			count++;
	}
	if(count >1)
	{	
		res.send({ err: "User is already a member.", code : 403});
		return false;
	}

	for(let i in model.toObject().users_pending)
	{
		let obj = model.users_pending[i];
		if(obj.user._id.equals(req.body.user))
		{
			model.users_pending.splice(i,1);
			break;
		}
	}
	return model;
} ));

router.get('/:id/users/:field_id', api.get_endpoint(Group , "users"));
router.put('/:id/users/:field_id', api.put_endpoint(Group , "users"));
router.delete('/:id/users/:field_id', api.delete_endpoint(Group , "users"));

//users_pending
router.get('/:id/users_pending/', api.list_endpoint(Group , "users_pending"));
router.post('/:id/users_pending/', api.post_endpoint(Group , "users_pending"));
router.get('/:id/users_pending/:field_id', api.get_endpoint(Group , "users_pending"));
router.put('/:id/users_pending/:field_id', api.put_endpoint(Group , "users_pending"));
router.delete('/:id/users_pending/:field_id', api.delete_endpoint(Group , "users_pending"));


//badges_required
router.get('/:id/badges_required/', api.list_endpoint(Group , "badges_required"));
router.post('/:id/badges_required/', api.post_endpoint(Group , "badges_required"));
router.get('/:id/badges_required/:field_id', api.get_endpoint(Group , "badges_required"));
router.put('/:id/badges_required/:field_id', api.put_endpoint(Group , "badges_required"));
router.delete('/:id/badges_required/:field_id', api.delete_endpoint(Group , "badges_required"));



module.exports = router;