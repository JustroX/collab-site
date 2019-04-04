var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/model_divider.js').model("User");

module.exports = function(passport)
{
	passport.serializeUser(function(user,done)
	{
		done(null, user.id);
	});

	passport.deserializeUser(function(id,done)
	{
		User.findById(id, function(err,user)
		{
			done(err,user);
		});
	});


	//for signup
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req,email,password,done)
		{
			process.nextTick(function()
			{
				let username = req.body.username;
				User.findOne({ 'private.local.email':email},function(err,user)
				{
					if(err) return done(err);
					if(user) return done(null,false,req.flash('signupMessage','That email is already taken.'));
					else
					User.findOne({ 'username':username},function(err,user)
					{
						if(user) return done(null,false,req.flash('signupMessage','That username is already taken.'));
						else
						{
							var newUser = new User();
							newUser.private.local.email = email;
							newUser.private.local.password = newUser.generateHash(password);
							newUser.username = username;

							newUser.save(function(err)
							{
								if(err) throw err;
								return done(null,newUser);
							});
						}
					});
				});
			});
		})
	);

	//for login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
		},
		function(req, email, password, done)
		{
			User.findOne({ 'private.local.email' : email }, function(err,user)
			{
				if(err) return done(err);
				if(!user) return done(null, false, req.flash('loginMessage','No user found'));

				if(!user.validPassword(password))
					return done(null, false, req.flash('loginMessage','Oops! Wrong password.'));
				return done(null, user);
			});
		})
	);
}