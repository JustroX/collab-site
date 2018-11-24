var router = require('express').Router();

module.exports = function(passport)
{
	
	//=========================//
	//   PUT NEW ROUTES HERE   //
	//=========================//
	
	router.use('/just', require('./just.js')(passport) );
	return router;
};