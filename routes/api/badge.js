var router = require('express').Router();
var Badge = require('../../models/model_divider.js').model("Badge");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Badge,function(req,res,model)
	{
		model.created_by  = req.session.passport.user;
		return model;
	}));
router.get('/', api.list(Badge) );
router.get('/:id', api.get(Badge));
router.put('/:id', api.logged, api.put(Badge, null, function(req,res,model)
	{
		if(!( model.created_by && model.created_by.equals( req.session.passport.user )))
		{
			res.send({ err: "Permission Denied" , code : 403});
			return false;
		}
		return true;
	}));
router.delete('/:id', api.logged, api.delete(Badge,null,function(req,res,model)
	{
		if(!( model.created_by && model.created_by.equals( req.session.passport.user )))
		{
			res.send({ err: "Permission Denied" , code : 403});
			return false;
		}
		return true;
	}));


module.exports = router;