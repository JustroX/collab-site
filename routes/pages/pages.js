var router = require('express').Router();

module.exports = function(passport)
{
	router.get('/welcome',(req,res)=>
	{
		res.render('pages/welcome');
	});
	router.get('/dashboard',(req,res)=>
	{
		res.render('pages/dashboard');
	});
	router.get('/profile',(req,res)=>
	{
		res.render('pages/profile');
	});
	router.get('/register',(req,res)=>
	{
		res.render('pages/register');
	});

	router.use('/tutorial', require('./tutorial/tutorial.js')(passport) )
	return router;
};