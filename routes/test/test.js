var router = require('express').Router();



module.exports = function(passport)
{

	router.get('/', goIfNotAuthenticated , function(req, res){
		res.render('try-page/index');
	});

    router.get('/login', goIfNotAuthenticated , function(req, res) {
        res.render('try-page/login', { message: req.flash('loginMessage') }); 
    });

    router.post('/login', passport.authenticate('local-login',{
        successRedirect: 'profile',
        failureRedirect: 'login',
        failureFlash: true
    }));
	
	router.get('/signup', goIfNotAuthenticated , function(req, res) {
        res.render('try-page/signup', { message: req.flash('loginMessage') }); 
    });

    router.post('/signup', passport.authenticate('local-signup',{
        successRedirect: 'profile',
        failure: 'signup',
        failureFlash: true
    }));


	router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/test/');
    });

    router.get('/profile', goIfAuthenticated , function(req,res)
    {
    	res.render('try-page/profile', {
    		user: req.user
    	});
    });

	return router;
};

function goIfAuthenticated(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function goIfNotAuthenticated(req,res,next)
{
    if(req.isAuthenticated())
        res.redirect('profile');
    next();
}