
exports.fields  =function(req,PERMISSIONS)
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
	if(fields.length==0) 
		fields = ['-private','-__v'];
	return fields;
}

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
		if(PERMISSIONS[i] && PERMISSIONS[i]&1)
		{
			let val = req.query[i].split("..");
			let item = { field: i };
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
	}

	let query = {};
	for(var i of filters)
	{
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
		if(PERMISSIONS[i])
		{
			a[i] = obj[i];
		}
	}
	return a;
}