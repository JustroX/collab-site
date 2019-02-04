var router = require('express').Router();


for(let model of require("../models/model_index.js").models)
{
	model  = model.toLowerCase();
	router.use('/'+model, require('./api/'+model+'.js'));
}

module.exports = router;