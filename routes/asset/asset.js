var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/*',(req,res)=>
	{
		var path = req.originalUrl.substr(8,req.originalUrl.length-8);
		res.sendFile(pth.join(__dirname,"/../../assets/",path));
	});
	return router;
};