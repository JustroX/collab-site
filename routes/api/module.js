var router = require('express').Router();

var Models = require('../../models/model_divider.js');

var Module = Models.model("Module");
var Article = Models.model("Article");
var Challenge = Models.model("Challenge");

var lib = require('./api-helper.js');
var api = require('./api-handler.js');



router.post('/', api.post(Module));
router.get('/', api.list(Module) );
router.get('/:id', api.get(Module));
router.put('/:id', api.put(Module));
router.delete('/:id', api.deleteAsync(Module,null,function(req,res,mod,done)
{
	let articles_arr = [];
	let challenges_arr = [];

	for(let i in mod.toObject().articles)
		articles_arr.push(mod.articles[i].content);

	for(let i in mod.toObject().challenges)
		challenges_arr.push(mod.challenges[i].content);

	Article.deleteMany({ _id : { $in: articles_arr } }, function(err)
	{
		if(err) return res.send({ code: 500, err: "Database Error"});
		Challenge.deleteMany({ _id : { $in: challenges_arr } }, function(err)
		{
			if(err) return res.send({ code: 500, err: "Database Error"});
			done();
		});
	});
}));

//articles
router.get('/:id/articles/', api.list_endpoint(Module , "articles"));
router.post('/:id/articles/', api.post_endpoint(Module , "articles"));
router.get('/:id/articles/:field_id', api.get_endpoint(Module , "articles"));
router.put('/:id/articles/:field_id', api.put_endpoint(Module , "articles" , null, null, function(req,res,model)
{
	//sort
	let pages = [];
	pages.push(...model.toObject().articles,...model.toObject().challenges );
	for(let i in pages)
	{
		let offset = model.toObject().articles.length;
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

	let inc = parseInt(req.body.inc);
	let page_id = req.params.field_id;

	for(let i in pages)
	{
		if(pages[i]._id.equals(page_id))
		{
			i  = parseInt(i);
			if((i+inc<pages.length) && (i+inc >= 0))
			{
				let t = pages[i];
				pages[i] = pages[i+inc];
				pages[i+inc] = t;
			}
			break;
		}
	}

	//label
	for(let i in pages)
	{
		if(pages[i].type=="article")
			model.articles[ pages[i].loc ].page = i;
		else
			model.challenges[ pages[i].loc ].page = i;
	}

	return true;

} ));
router.delete('/:id/articles/:field_id', api.delete_endpoint(Module , "articles"));
//challenges
router.get('/:id/challenges/', api.list_endpoint(Module , "challenges"));
router.post('/:id/challenges/', api.post_endpoint(Module , "challenges"));
router.get('/:id/challenges/:field_id', api.get_endpoint(Module , "challenges"));
router.put('/:id/challenges/:field_id', api.put_endpoint(Module , "challenges", null, null,function(req,res,model)
{
	//sort
	let pages = [];
	pages.push(...model.toObject().articles,...model.toObject().challenges );
	for(let i in pages)
	{
		let offset = model.toObject().articles.length;
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

	let inc = parseInt(req.body.inc);
	let page_id = req.params.field_id;

	for(let i in pages)
	{
		if(pages[i]._id.equals(page_id))
		{
			i  = parseInt(i);
			if((i+inc<pages.length) && (i+inc >= 0))
			{
				let t = pages[i];
				pages[i] = pages[i+inc];
				pages[i+inc] = t;
			}
			break;
		}
	}

	//label
	for(let i in pages)
	{
		if(pages[i].type=="article")
			model.articles[ pages[i].loc ].page = i;
		else
			model.challenges[ pages[i].loc ].page = i;
	}

	return true;

} ));
router.delete('/:id/challenges/:field_id', api.delete_endpoint(Module , "challenges"));
//badges
router.get('/:id/badges/', api.list_endpoint(Module , "badges"));
router.post('/:id/badges/', api.post_endpoint(Module , "badges"));
router.get('/:id/badges/:field_id', api.get_endpoint(Module , "badges"));
router.put('/:id/badges/:field_id', api.put_endpoint(Module , "badges"));
router.delete('/:id/badges/:field_id', api.delete_endpoint(Module , "badges"));

module.exports = router;