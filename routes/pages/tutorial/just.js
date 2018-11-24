var router = require('express').Router();



module.exports = (passport) =>
{
	router.get('/', function(req, res){
		res.render('tutorial-pages/index',{ user: "just" });
	});
	router.get('/first', function(req, res){
		res.render('tutorial-pages/first');
	});
	router.get('/second', function(req, res){
		res.render('tutorial-pages/second');
	});

	return router;
} ;