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

		mod.challenges.push({ content: model._id , page: mod.toObject().challenges.length + mod.toObject().articles.length });
		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));
router.get('/', api.list(Challenge) );
router.get('/:id', api.get(Challenge,function(req,res,output)
{
	//check permission for user
	Challenge.findById(req.params.id,function(err,challenge)
	{
		challenge.is_authorized(req,res,4,function(authorized)
		{
			if(!authorized)
			{
				for(let i =0; i < output.testcases.length ; i++)
					if(!output.testcases[i].sample)
					{
						output.testcases.splice(i,1);
						i--;
					}
			}
			res.send(output);
		});
	});
	//hide hidden testcase

}));
router.put('/:id', api.putAsync(Challenge,function(req,res,model,done)
{
	let user = req.session.passport.user;
	let found = false;
	for(let i in model.toObject().authors)
	{ 
		found |= (model.authors[i].user.equals(user));
	}
	if(!found)
		model.authors.push({ user: user});
	done();
}));


router.delete('/:id',  api.deleteAsync(Challenge,null,function(req,res,model,done)
{
	Module.findById(model.module,function(err,mod)
	{
		if(err) return res.send({ err: "Database Error.", code: 500 });
		if(!mod) return res.send({ err: "Module not found.", code: 404});

		for(let i in mod.toObject().challenges)
		{
			if(mod.challenges[i].content && mod.challenges[i].content.equals(model._id))
			{
				mod.challenges.splice(i,1);
				break;
			}
		}
		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));


module.exports = router;