var router = require('express').Router();

var handler = require('../../models/model_divider.js');
var Challenge = handler.model("Challenge");
var Module = handler.model("Module");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.postAsync(Challenge,function(req,res,model,done)
{
	let user = req.session.passport.user;
	let found = false;
	for(let i in model.toObject().authors)
		found |= (model.authors[i].equals(user));
	if(!found)
		model.authors.push({ user: user});

	Module.findById(model.module,function(err,mod)
	{
		if(err) return res.send({ err: "Database Error.", code: 500 });
		if(!mod) return res.send({ err: "Module not found.", code: 404});

		mod.challenges.push({ content: model._id , page: mod.toObject().challenges.length });
		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));
router.get('/', api.list(Challenge) );
router.get('/:id', api.get(Challenge));
router.put('/:id', api.put(Challenge));
router.delete('/:id', api.delete(Challenge));

//testcases
router.get('/:id/testcases/', api.list_endpoint(Challenge , "testcases"));
router.post('/:id/testcases/', api.post_endpoint(Challenge , "testcases"));
router.get('/:id/testcases/:field_id', api.get_endpoint(Challenge , "testcases"));
router.put('/:id/testcases/:field_id', api.put_endpoint(Challenge , "testcases"));
router.delete('/:id/testcases/:field_id', api.delete_endpoint(Challenge , "testcases"));


module.exports = router;