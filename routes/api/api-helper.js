var User = require('../../models/user.js');

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

exports.logged	 = function(req,res,next)
{
	if(!(req.session && req.session.passport && req.session.passport.user))
		return res.send({ err: 'Please login to continue', code: 403})
	next();

	// WHEN GMAIL API IS DONE
	// User.find({_id: req.session.passport.user}).exec(function(err,user)
	// {
	// 	if(err) return res.send({err:"Database Error", code: 500});
	// 	if(!user.confirmed)
	// 		return res.send({err:"Please confirm your account.", err: 403});
	// 	next();
	// });
}
exports.loggedAlone	 = function(req,res,next)
{
	if(!(req.session && req.session.passport && req.session.passport.user))
		return res.send({ err: 'Please login to continue', code: 403})
	next();
}

exports.admin_user = function(perm)
{
	return function(req,res,next)
	{
		let id = req.session.passport.user;
		User.findById(id, function(err,user)
		{
			if(user.admin_user_permissions & perm )
				next();
			else
				return res.send({err: 'Permission Denied'});
		});
		
	}
}


exports.admin_user_or_self = function(perm)
{
	return function(req,res,next)
	{
		let id = req.session.passport.user;
		if(req.params.id == id)
			next();
		else
		User.findById(id, function(err,user)
		{
			if(user.admin_user_permissions & perm )
				next();
			else
				return res.send({err: 'Permission Denied'});
		});
		
	}
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

