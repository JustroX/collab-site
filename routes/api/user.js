var router = require('express').Router();
var Divider = require('../../models/model_divider.js');
var User = Divider.model("User");
var Invitation = Divider.model("Invitation");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');





router.post('/', api.logged, api.post(User));

router.post('/register',  function(req,res,next)
{
	Invitation.findById(req.body.invitation , function(err,mod)
	{
		if(err) return res.send({ err: "Database Error", code: 500 });
		if(!mod || (mod && mod.confirmed ) ) return res.send({ err: "Invalid invitation" });
		next();
	} );
}, 
api.post_override(User,function(req,res,user,temp)
{
	user.password = user.generateHash(req.body.password);
	user.authorization = { try: "autofill" };
	return user;
},function(req,res,out)
{
	Invitation.findById(req.body.invitation , function(err,mod)
	{
		if(err) return res.send({ err: "Database Error", code: 500 });
		mod.user = out._id;
		mod.save(function(err)
		{
			if(err) return res.send({ err: "Database Error", code: 500 });
			return res.send(out);	
		});
	} );

})
);

router.get('/', api.list(User) );


router.get('/tour', api.logged, function(req,res,next)
{
	let path = req.query.path;
	User.findById(req.session.passport.user,function(err,user)
	{
		// console.log("Path is",path);
		user.tour[path] = true;
		user.save(function(err,u)
		{
			res.send({ code: 200, message: "User updated." });
		});
	});
});

router.get('/self', api.logged, function(req,res,next)
{
	req.params.id = req.session.passport.user;
	next();
}, api.get(User));

router.get('/:id', api.get(User));

router.put('/:id', function(req,res,next)
{
	let PERMISSIONS   = User.config.PERMISSIONS;
	let user_id = req.params.id;
	let query = lib.sanitize(req,PERMISSIONS);

	User.findById(user_id, function(err, user)
	{
		if(err) return res.send({ err: "Database Error" , code: 500 });

		let proceed = function(){

			let old_name = JSON.parse(JSON.stringify(user.name));
			// console.log(old_name.first);

			for(let i in query)
			{
				if(i=="password") continue;
				user[i] = query[i];
			}
			if(req.body.password!=req.body.confirm_password)
			{
				return res.send({err: "Passwords doesn't match." , code: 403});	
			}
			if(req.body.password)
			{
				console.log(user);
				if( !user.validPassword(req.body.old_password) && old_name.first )
					return res.send({err: "Password is incorrect" , code: 403});
				user.password = user.generateHash(req.body.password);
			}
			if(req.body.email)
				user.email = req.body.email;
			user.save(function(err, updatedUser)
			{
				if(err) throw err;

				let output = lib.hide_fields(updatedUser,PERMISSIONS);

				res.send(output);
			});

		};

		let proceed_to_email = function()
		{
			if(req.body.private && req.body.private.local && req.body.private.local.email)
				User.find({ "private.local.email" : req.body.private.local.email , _id : { $ne : user_id } }).exec(function(err,docs)
				{
					if(err) return res.send({err: "Database Error", code: 500});
					if(docs.length >0) return res.send({err: "Email is not available."});
					proceed();			
				});
			else
				proceed();
		}

		if(query.username)
			User.find({ "username" : query.username , _id : { $ne : user_id } }).exec(function(err,docs)
			{
				if(err) return res.send({err: "Database Error", code: 500});
				if(docs.length >0) return res.send({err: "Username is not available."});
				proceed_to_email();			
			});
		else
			proceed_to_email();
	});
});

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
		},
		function(req,res,model)
		{
			let found = false;
			for(let i in model.toObject().followed_by)
			{
				let a = model.followed_by[i];
				if(a.user.equals(req.session.passport.user))
				{
					console.log(a.user,req.session.passport.user);
					res.send({ err: "Already following" , code: 403 });
					return false;
				}
			}
			console.log("reached");
			return true;
		}
		)
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