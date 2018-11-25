var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/main.js',(req,res)=>
	{
		res.sendFile(pth.join(__dirname,"../../scripts/main.js"));
	});
	router.get('/loginController.js',(req,res)=>
	{
		res.sendFile(pth.join(__dirname,"../../scripts/loginController.js"));
	});
	router.get('/dashboardController.js',(req,res)=>
	{
		res.sendFile(pth.join(__dirname,"../../scripts/dashboardController.js"));
	});
	return router;
};