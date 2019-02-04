module.exports = function(app,passport)
{
	app.use('/auth', require('./auth.js')(passport) );
	app.use('/scripts', require('./script.js')(passport) );
	app.use('/page', require('./page.js')(passport) );
	app.use('/master', require('./master.js')(passport) );
	app.use('/template', require('./template.js')(passport) );
	app.use('/model', require('./model.js')(passport) );
	app.use('/assets', require('./assets.js')(passport) );
};