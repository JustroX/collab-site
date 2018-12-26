var router = require('express').Router();

module.exports = function(passport)
{

	router.get('/components/*',(req,res)=>
	{
		var path = req.originalUrl.substr(7,req.originalUrl.length-5);
		res.render(path);
	});

	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(1,req.originalUrl.length-0);
		res.render(path);
	})

	router.use('/tutorial', require('./tutorial/tutorial.js')(passport) )
	return router;
};