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

		mod.articles.push({ content: model._id , page: mod.toObject().challenges.length + mod.toObject().articles.length });
		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));
router.get('/', api.list(Article) );
router.get('/:id', api.get(Article));
router.put('/:id',api.putAsync(Article,function(req,res,model,done)
{
	let user = req.session.passport.user;
	let found = false;
	for(let i in model.toObject().authors)
		found |= (model.authors[i].equals(user));
	if(!found)
		model.authors.push({ user: user});
	done();
}));
router.delete('/:id', api.deleteAsync(Article,null,function(req,res,model,done)
{
	Module.findById(model.module,function(err,mod)
	{
		if(err) return res.send({ err: "Database Error.", code: 500 });
		if(!mod) return res.send({ err: "Module not found.", code: 404});

		console.log("LOOK HERE",mod.articles);
		for(let i in mod.toObject().articles)
		{
			if(mod.articles[i].content && mod.articles[i].content.equals(model._id))
			{
				mod.articles.splice(i,1);
				break;
			}
		}

		let pages = [];
		pages.push(...mod.toObject().articles,...mod.toObject().challenges );
		for(let i in pages)
		{
			let offset = mod.toObject().articles.length;
			if( i < offset )
			{
				pages[i].type = "article";
				pages[i].loc = i;
			}
			else
			{
				pages[i].type = "challenge";
				pages[i].loc = i-offset;
			}
		}

		pages.sort((a,b)=>a.page-b.page);
		for(let i in pages)
		{
			if(pages[i].type=="article")
				mod.articles[ pages[i].loc ].page = i;
			else
				mod.challenges[ pages[i].loc ].page = i;
		}		

		mod.save(function(err,new_mod)
		{
			if(err) return res.send({ err: "Database Error.", code: 500 });
			done();
		});
	});
}));

module.exports = router;