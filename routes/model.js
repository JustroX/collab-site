var router = require('express').Router();
var pth = require('path');

module.exports = function(passport)
{
	router.get('/models.json',(req,res)=>
	{
		var path = req.originalUrl.substr(6,req.originalUrl.length-6);
		res.render("models/definitions.ejs",{ models: require("./../models/model_index.js").models });
	});
	return router;
};