var divider = require('../../models/model_divider.js');
var User = divider.model("User");


exports.fields  =function(req,PERMISSIONS,endpoint)
{
	let fields = [];
	if(req.query.fields)
	{
		var q_fields = req.query.fields.split(",");
		for(let i of q_fields)
		{
			if(PERMISSIONS[i] && PERMISSIONS[i]&1)
			{
				fields.push(i);
			}
		}
	}
	if(endpoint)
		for(let i in fields)
			fields[i] = endpoint +"."+fields[i];
	if(fields.length==0) 
		fields = ['-__v','-private.local.password'];
	return fields;
}

var authorize = function(config,res)
{
	//{ model: "model" , user: _id, model_id: _id, field: _id }
	let a;
	let b2;
	let Model = divider.model(config.model);
	Model.findById(config.model_id,function(err,instance)
	{
		if(instance[config.field].includes(config._id))
			a && a(b2,res);
		else
			return res.send({ err: "Not authorized for "+config.model , code: 501 });
	});
	let r =	{	

		authorize: function(config2)
		{
			b2 = config2;
			a = authorize;
		}
	}
	return r;
}

exports.authorize =  authorize;

exports.sort = function(req,PERMISSIONS)
{
	let sort = {};
	if(req.query.sort)
	{
		var q_fields = req.query.sort.split(",");
		for(let i of q_fields)
		{
			var str = (i[0]=='-')? i.substring(1) : i;
			if(PERMISSIONS[str])
			{
				sort[str] = 1 - 2*(i[0]=='-');
			}
		}
	}
	return sort;
}

exports.filter = function(req,PERMISSIONS)
{
	let filters = [];	
	for(var i in req.query)
	{
		if(i=="search" || (PERMISSIONS[i.split(".")[0]] &1) || (PERMISSIONS[i] && PERMISSIONS[i]&1))
		{
			let val = req.query[i].split("..");
			let item = { field: i };
			if(i=="search")
			{
				let subfields  = val[0].split(",");
				item.or = [];
				for(let j in subfields)
				{
					let b = subfields[j].split(":");
					let a = {};
					a[b[0]] = { $regex: new RegExp(b[1]) , $options: 'i' };
					item.or.push(a);
				}
			}
			else
			if(val.length==1 && val[0].substring(0,3)=="rx_")
			{
				item.regex = val[0].substring(3);
			}
			else
			if(val.length==1 && val[0].substring(0,3)=="ne_")
			{
				item.ne = val[0].substring(3);
			}
			else
			if(val.length==1)
				item.set = val[0];
			else
			{
				if(val[0] != '-')
					item.gte = val[0]
				if(val[1] != '-')
					item.lte = val[1]
			}
			filters.push(item);
		}
	};
	let query = {};
	for(var i of filters)
	{
		if(i.or)
		{
			query["$or"] = i.or;
		}
		else
		if(i.regex)
		{
			query[i.field] = { $regex: new RegExp(i.regex) , $options: 'i' };
		}
		else
		if(i.ne)
		{
			query[i.field] = { $ne: i.ne };
		}
		else
		if(i.set)
			query[i.field] = i.set;
		else
		{
			query[i.field] = {};
			if(i.gte)
				query[i.field].$gte = i.gte ;
			if(i.lte)
				query[i.field].$lte = i.lte ;
		}
	}
	return query;
}


exports.sanitize = function(req,PERMISSIONS)
{
	let body = req.body;

	let query = {};

	for(let i in body)
	{
		if(PERMISSIONS[i]&4)
		{
			query[i] = body[i];
		}
	}

	return query;
}

exports.hide_fields = function(obj,PERMISSIONS)
{
	let a = {};
	for(let i in obj)
	{
		if(PERMISSIONS[i]&1)
		{
			a[i] = obj[i];
		}
	}
	return a;
}

exports.validate_fields = function(req,res,PERMISSIONS)
{
	let body = req.body;

	let complete = true;
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			complete &= body[i] != null
		}
	}

	if(!complete)
		res.send({ code: 400, err: "Invalid request." });
	return complete
}

