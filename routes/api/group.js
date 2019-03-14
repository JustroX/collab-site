var router = require('express').Router();
var Divider= require('../../models/model_divider.js');
var Group = Divider.model("Group");
var User = Divider.model("User");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');

function permit(endpoint,num) 
{
	return function(req,res,model)
	{
		let permission = model.is_authorized_sync(req,res,endpoint,num); 
		if(!permission) res.send({ code: 403, err: "Permission Denied." });
		return permission;
	}
}

router.post('/', api.logged, api.post(Group ,function(req,res,model)
{
	model.ranks.push({ name: "admin", permissions: {
		group: 15,
		users: 15,
		module: 15,
		post: 15,
	}, default: false, persistent: true  });
	model.ranks.push({ name: "member", permissions: 
	{
		group: 1,
		users: 0,
		module: 0,
		post: 0,		
	}, default: true, persistent: true   });
	model.users.push({ user: req.session.passport.user, rank: model.ranks[0]._id});
	return model;
}));
router.get('/', api.logged, api.list(Group) );
router.get('/:id', api.logged, api.get(Group));
router.put('/:id', api.logged,  api.put(Group,null,permit("group",2)));
router.delete('/:id', api.logged, api.delete(Group,null,permit("group",4)));


//ranks
router.get('/:id/ranks/', 			 api.logged, api.list_endpoint  (Group , "ranks"));
router.get('/:id/ranks/:field_id', 	 api.logged, api.get_endpoint   (Group , "ranks"));
router.post('/:id/ranks/', 			 api.logged, api.post_endpoint  (Group , "ranks" , null, null, permit("group",2) ));
router.put('/:id/ranks/:field_id', 	 api.logged, api.put_endpoint   (Group , "ranks" , null, null, permit("group",2) ));
router.delete('/:id/ranks/:field_id',api.logged, api.delete_endpoint(Group , "ranks" , null, null, permit("group",2) ));

//users
router.get('/:id/users/', api.list_endpoint(Group , "users"));
router.post('/:id/users/join', api.logged, 
function(req,res,next)
{
	req.body.user = req.session.passport.user;
	req.body.rank = 1;
	next();
}, api.post_endpoint_async(Group , "users" ,function(req,res,model,done)
{
	User.findById(req.session.passport.user,function(err,user)
	{
		if(err) return res.send({ err: "Database Error" , code : 500 });

		if(model.is_badge_complete(user))
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

			for(let i in model.toObject().users)
			{
				let obj = model.users[i];
				if(obj.user._id.equals(req.body.user))
					model.users[i].rank = model.get_default_rank();
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

			done();
		}
		else
			return res.send({ err: "Your badges is incomplete.", code: 403 });
	});
}));



router.post('/:id/users/', api.logged, api.post_endpoint(Group , "users" ,function(req,res,model)
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
}, null, permit("users",1)));



router.get('/:id/users/:field_id', api.get_endpoint(Group , "users"));
router.put('/:id/users/:field_id', api.logged, api.put_endpoint(Group , "users",		null, null, permit("users",2) ));
router.delete('/:id/users/:field_id', api.logged, api.delete_endpoint(Group , "users",	null, null, permit("users",4) ));

//users_pending
router.get('/:id/users_pending/', api.list_endpoint(Group , "users_pending"));
router.post('/:id/users_pending/', api.logged, function(req,res,next)
{
	req.body.user = req.session.passport.user;
	next();
}, api.post_endpoint(Group , "users_pending"));
router.get('/:id/users_pending/:field_id', api.get_endpoint(Group , "users_pending"));


router.put('/:id/users_pending/:field_id', api.logged,    api.put_endpoint   (Group , "users_pending", null, null, permit("users", 2)));
router.delete('/:id/users_pending/:field_id', api.logged, api.delete_endpoint(Group , "users_pending", null, null, permit("users", 4)));


//badges_required
router.get('/:id/badges_required/', 						api.list_endpoint(Group , "badges_required"));
router.post('/:id/badges_required/', api.logged,			api.post_endpoint(Group , "badges_required", function(req,res,model)
{
	let count = 0;
	for(let i in model.toObject().badges_required)
	{
		let obj = model.badges_required[i];
		if(obj.badge._id.equals(req.body.badge))
			count++;
	}
	if(count >1)
	{	
		res.send({ err: "Badge is already selected.", code : 403});
		return false;
	}
	return model;
}, null, permit("group",2) ));
router.get('/:id/badges_required/:field_id', 				api.get_endpoint(Group , "badges_required"));
router.put('/:id/badges_required/:field_id', api.logged, 	api.put_endpoint(Group , "badges_required", null, null, permit("group",2)));
router.delete('/:id/badges_required/:field_id', api.logged, api.delete_endpoint(Group , "badges_required", null, null, permit("group",2)));



module.exports = router;