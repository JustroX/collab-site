var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/',(req,res)=>
	{
		res.render("master/dashboard");
	});
	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(7,req.originalUrl.length-7);
		res.render("master/"+path);
	});
	return router;
};