var router = require('express').Router();

module.exports = function(passport)
{
	router.get('/welcome',(req,res)=>
	{
		res.render('pages/welcome');
	});

	router.get('/shared/navbar',(req,res)=>
	{
		res.render('pages/shared/navbar');
	});


	router.get('/dashboard',(req,res)=>
	{
		res.render('pages/dashboard');
	});

	router.get('/dashboard/notification',(req,res)=>
	{
		res.render('pages/dashboard/notification');
	});
	router.get('/dashboard/guild-navigation',(req,res)=>
	{
		res.render('pages/dashboard/guild-navigation');
	});
	router.get('/dashboard/contacts',(req,res)=>
	{
		res.render('pages/dashboard/contacts');
	});
	router.get('/dashboard/newsfeed',(req,res)=>
	{
		res.render('pages/dashboard/newsfeed');
	});





	router.get('/guild',(req,res)=>
	{
		res.render('pages/guild');
	});
	router.get('/guild/list',(req,res)=>
	{
		res.render('pages/guild/list');
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