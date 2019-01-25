var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(6,req.originalUrl.length-6);
		res.render("pages/static/"+path);
	});
	return router;
};