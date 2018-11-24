var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/main.js',(req,res)=>
	{
		res.sendFile(pth.join(__dirname,"../../scripts/main.js"));
	});
	return router;
};