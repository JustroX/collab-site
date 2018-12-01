var router = require('express').Router();



module.exports = (passport) =>
{
	router.post('/login',function(req,res,next)
	{
		if(req.isAuthenticated())
			return res.send('Already authenticated');
		next();
	}
	,function(req,res,next)
	{
		passport.authenticate('local-login',{failureFlash: true} , function(err,user,info)
		{
			if(err) return next(err);
			if(user)
			{
				req.login(user,function(err)
				{
					if(err) return next(err);
					else
						res.send({ message : 'Logged In' })	
				});
			}
			else
			if(info)
				res.send(info);
			else
				res.send(req.flash('loginMessage')[0])
			next()
		})(req,res,next);
	});

	router.get('/logout', function(req, res) {
        req.logout();
        res.send({ message : "You are logged out." });
    });

	router.post('/signup', function(req,res,next)
	{
		if(req.isAuthenticated())
			return res.send('Already authenticated');
		next();
	}
	,function(req,res,next)
	{
		passport.authenticate('local-signup',{failureFlash: true} , function(err,user,info)
		{
			if(err) return next(err);
			if(user)
			{
				req.login(user,function(err)
				{
					if(err) return next(err);
					else
						res.send({ message : 'Logged In' })	
				});
			}
			else
			if(info)
				res.send(info);
			else
				res.send(req.flash('signupMessage')[0])
			next()
		})(req,res,next);
	});


	return router;
} ;