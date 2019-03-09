var router = require('express').Router();
var User = require('../../models/model_divider.js').model("User");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');





router.post('/', api.post(User));
router.get('/', api.list(User) );

router.get('/self', api.logged, function(req,res,next)
{
	req.params.id = req.session.passport.user;
	next();
}, api.get(User));

router.get('/:id', api.get(User));
router.put('/:id', api.put(User));
router.delete('/:id', api.delete(User));



//follows
router.get('/:id/followed_by/', api.logged, api.list_endpoint(User , "followed_by"));
router.post('/:id/followed_by/', api.logged,
	function(req,res,next)
	{
		req.body.user = req.session.passport.user;
		next();
	},
	api.post_endpoint(User , "followed_by", null,
		function(req,res,output)
		{
			User.findById(req.session.passport.user, function(err,me)
			{
				if(err) return res.send({ code: 500, err: "Database Error" });
				me.follows.push({ user : req.params.id});
				me.save(function(err)
				{
					if(err) return res.send({ code: 500, err: "Database Error" });
					res.send(output);
				});
			});
		})
	);
router.get('/:id/followed_by/:field_id', api.logged, api.get_endpoint(User , "followed_by"));
router.put('/:id/followed_by/:field_id', api.logged, api.put_endpoint(User , "followed_by"));


router.delete('/:id/followed_by/:field_id', api.logged, api.delete_endpoint(User , "followed_by", null, function(req,res)
	{
		User.findById(req.session.passport.user, function(err,me)
		{
			if(err) return res.send({ code: 500, err: "Database Error" });
		
			for(let i in me.toObject().follows)
			{
				if( me.toObject().follows[i].user.equals(req.params.id)  )
				{
					me.follows.splice(i,1);
					break;
				}
			}
			me.save(function(err)
			{
				if(err) return res.send({ code: 500, err: "Database Error" });
				res.send({ code: 200, mes: "Success"});
			});
		});
	}));


module.exports = router;