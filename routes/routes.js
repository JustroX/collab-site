/*********************

	Main API router

**********************/

module.exports = function(app,passport)
{
	app.use('/test', require('./test/test.js')(passport) )
	app.use('/pages', require('./pages/pages.js')(passport) )
};