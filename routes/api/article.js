var router = require('express').Router();

var handler = require('../../models/model_divider.js');
var Article = handler.model("Article");
var Module = handler.model("Module");


var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.postAsync(Article,function(req,res,model,done)
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

		mod.articles.push({ content: model._id , page: mod.toObject().articles.length });
		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));
router.get('/', api.list(Article) );
router.get('/:id', api.get(Article));
router.put('/:id', api.put(Article));
router.delete('/:id', api.delete(Article));

module.exports = router;