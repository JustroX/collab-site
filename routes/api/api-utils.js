var Divider = require('../../models/model_divider.js');

function get_value(obj,str)
{
	let parent = obj;
	let keys = str.split(".");

	for(let i in keys)
	{
		parent = parent[i];
	}
	return parent;
}

exports.set_model = function(model) 
{
	return function(req,res,next)
	{
		if(!req.truck) req.truck = {};
		req.truck.model = model;
		next();
	}
}

exports.new = function()
{
	return function(req,res,next)
	{
		let Model = Divider.model(req.truck.model);
		req.truck.inst = new Model();
		next();
	}
}

exports.get = function()
{
	return function(req,res,next)
	{
		let Model = Divider.model(req.truck.model);
		if(!req.params.id) return res.send({ err: "No model id specified.", code: 404});
		Model.findById( req.params.id , function(err, model)
		{
			if(!model) return res.send({err: "Database error", code: 500});
			req.truck.inst = model;
			next();
		});
	}
}

exports.child = function(key,model)
{
	return function(req,res,next)
	{
		let Model = Divider.model(model);
		let obj = get_value(req.truck.inst,key);
		if(!obj) return res.send({ err: "Wrong key specified", code: 500 });

		Model.findById( obj , function(err,model)
		{
			if(!model) return res.send({err: "Database error", code: 500});
			req.truck.inst = model;
			next();
		} );
	}
}

exports.authorize  =function(num)
{
	return function(req,res,next)
	{
		if(!req.truck.model.is_authorized(req,res,num)) return res.send({ code: 403, err: "Model permission Denied" });
		next();
	}
}
