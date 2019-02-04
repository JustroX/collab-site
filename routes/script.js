var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(9,req.originalUrl.length-9);
		res.sendFile(pth.join(__dirname,"/../scripts/",path));
	});
	return router;
};