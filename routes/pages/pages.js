var router = require('express').Router();

module.exports = function(passport)
{
	router.use('/tutorial', require('./tutorial/tutorial.js')(passport) )
	return router;
};