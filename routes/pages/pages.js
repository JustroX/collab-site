var router = require('express').Router();

module.exports = function(passport)
{
	router.get('/welcome',(req,res)=>
	{
		res.render('pages/welcome');
	});

	router.use('/tutorial', require('./tutorial/tutorial.js')(passport) )
	return router;
};