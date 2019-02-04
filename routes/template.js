var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(10,req.originalUrl.length-10);
		res.render("template/"+path);
	});
	return router;
};