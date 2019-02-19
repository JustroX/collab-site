var lib = require('./api-helper.js');
var User = require('../../models/model_divider.js').model("User");

function get_permission(Model,req,res,perm,PERMISSIONS,cb)
{
	let user = req.session.passport && req.session.passport.user;
	let num;
	let new_perm = JSON.parse(JSON.stringify(PERMISSIONS));
	if(user)
		User.findById(user,function(err,data)
		{
			if(err) return res.send({err: "Database Error", code: 500});
			let model_name = Model.collection.collectionName.toLowerCase();
			let auth = data.toObject().authorization[model_name];
			if(auth)
			{
				num = auth.all;
				if(num&perm)
				{
					for(let i in auth)
					{
						if(i=="all") continue;
						new_perm[i] = auth[i];
					}
				}
			}
			else
			if(data._id.equals(req.params.id))
			{
				num = Model.selfPermission();
			}
			else
			{
				num = Model.defaultPermission();
			}
			if(num&perm)
				cb(new_perm);
			else
				res.send({err:"Permission Denied", code: 403});
		});
	else
	{
		num  = Model.defaultPermission();
		if(num&perm)
			cb(new_perm);
		else
			res.send({err:"Permission Denied", code: 403});
	}


}
exports.get = function(Model,cb)
{
	let PERMISSIONS = Model.config.PERMISSIONS;
	let POPULATE = Model.config.POPULATE;
	return function(req,res,next)
	{
		get_permission(Model,req,res,1,PERMISSIONS,function(PERMISSIONS)
		{
			let target_id = req.params.id;
			let fields = lib.fields(req,PERMISSIONS);
			let sort = lib.sort(req,PERMISSIONS);

			let q = Model.find({_id: target_id},fields.join(' '));
			for(let i in POPULATE)
				q = q.populate(i,POPULATE[i]);
			q.exec(function(err,docs)
			{
				if(err) return res.send({code: 500, err: 'Database error'});
				if(!docs.length) return res.send({ code: 500 , err: 'Doc not found.' });
				let output = lib.hide_fields(docs[0],PERMISSIONS);
				if(cb)
					cb(req,res,output);
				else
					res.send(output);
			});
		});
	}
}


exports.post = function(Model,custom,cb)
{
	let PERMISSIONS = Model.config.PERMISSIONS;
	return function(req,res,next)
	{
		get_permission(Model,req,res,2,PERMISSIONS,function(PERMISSIONS)
		{
			if(! lib.validate_fields(req,res,PERMISSIONS)) return;
			let model = new Model();
			let temp_query = {};
			for(let i in PERMISSIONS)
				if(PERMISSIONS[i]&2)
					temp_query[i] = req.body[i];

			model.set(temp_query);
			if(custom)
				model = custom(req,res,model,temp_query);
			model.save(function(err,model)
			{
				if(err) return res.send({ code: 500, err: 'Database Error' });
				let output = lib.hide_fields(model,PERMISSIONS);
				if(cb) cb(req,res,output); else res.send(output);
			});
		});
	}
}

exports.put = function(Model,custom,pre,cb)
{
	let PERMISSIONS = Model.config.PERMISSIONS;
	return function(req,res,next)
	{
		get_permission(Model,req,res,4,PERMISSIONS,function(PERMISSIONS)
		{
			let target_id = req.params.id;
			let query = lib.sanitize(req,PERMISSIONS);

			Model.findById(target_id, function(err, model)
			{
				if(err) return res.send({ code: 500, err: 'Database Error' });	
				if(!model) return res.send({ code: 500 , err: 'Doc not found.' });
				if(pre && !pre(req,res,model)) 
					return;
				model.set(query);
				if(custom)
					model = custom(req,res,model);

				model.save(function(err, updatedModel)
				{
					if(err) return res.send({ code: 500, err: 'Database Error' });
					let output = lib.hide_fields(updatedModel,PERMISSIONS);
					if(cb) cb(req,res,updatedModel);
					else res.send(output);
				});
			});
		});
	}

}

exports.delete = function(Model,cb,pre)
{
	let PERMISSIONS = Model.config.PERMISSIONS;
	return function(req,res,next)
	{
		get_permission(Model,req,res,8,PERMISSIONS,function(PERMISSIONS)
		{
			let target_id = req.params.id;
			Model.findById(target_id,function(err,mod)
			{
				if(err) return res.send({ err: "Database Error", code: 500});
				if(!pre || pre(req,res,mod))
				Model.deleteOne({ _id: target_id },function(err)
				{
					if(err) return res.send({ err : "Unknown Error" });
					else
					{
						if(cb) cb(req,res);
						else return res.send({ message: "Delete successful" })
					}
				});
			});
		});

	}
}



exports.list = function(Model,cb)
{
	let PERMISSIONS = Model.config.PERMISSIONS;
	let POPULATE = Model.config.POPULATE;
	return function(req,res,next)
	{
		get_permission(Model,req,res,1,PERMISSIONS,function(PERMISSIONS)
		{
			let fields = lib.fields(req,PERMISSIONS);
			let sort = lib.sort(req,PERMISSIONS);
			let query = lib.filter(req,PERMISSIONS);
			let options = req.query.option;

			let limit =  (req.query.limit || 10)-1+1;
			let offset = (req.query.offset || 0)-1+1;


			if(options)
			{
				let opt = {};
				Model.count({},function(err,count)
				{
					opt.collectionCount = count;
					if(cb)
						cb(req,res,opt)
					else
						res.send(opt);
				});
			}
			else
			{
				let q = Model.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset);
				for(let i in POPULATE)
					q = q.populate(i,POPULATE[i]);

				q.exec(function(err,docs)
				{
					if(err) return res.send({ err: "Database Error" , code: 500 });
					if(cb)
						cb(req,res,docs);
					else
						res.send(docs);
				});
			}
		});
	}
}



//endpoints

function get_permission_endpoint(Model,endpoint,req,res,perm,cb)
{
	let user = req.session.passport && req.session.passport.user;
	let num;
	if(user)
		User.findById(user,function(err,data)
		{
			if(err) return res.send({err: "Database Error", code: 500});
			let model_name = Model.collection.collectionName.toLowerCase();
			let auth = data.toObject().authorization[model_name];
			if(auth)
			{
				num = auth.all;
				if( num&perm && auth[endpoint])
					num = auth[endpoint]
				else
					num = Model.config.PERMISSIONS_ENDPOINT[endpoint];
			}
			else
			{
				console.log(Model.config)
				num = Model.config.PERMISSIONS_ENDPOINT[endpoint];
			}
			console.log(num,perm);
			if(num&perm)
				cb();
			else
				res.send({err:"Permission Denied", code: 403});
		});
	else
	{
		num  = Model.config.PERMISSIONS_ENDPOINT[endpoint];
		if(num&perm)
			cb();
		else
			res.send({err:"Permission Denied", code: 403});
	}


}

exports.list_endpoint = function(Model,endpoint,cb)
{
	let PERMISSIONS = Model.config.endpoints[endpoint];
	let POPULATE = PERMISSIONS.populate || {};

	return function(req,res,next)
	{
		get_permission_endpoint(Model,endpoint,req,res,1,function()
		{
			let fields = lib.fields(req,PERMISSIONS,endpoint);
			let sort = lib.sort(req,PERMISSIONS);
			let query = lib.filter(req,PERMISSIONS);
			let options = req.query.option;

			let limit =  (req.query.limit || 10)-1+1;
			let offset = (req.query.offset || 0)-1+1;

			if(options)
			{
				let opt = {};
				Model.findById(req.params.id,function(err,model)
				{
					if(err) return res.send({code: 500, err: "Database Error"});
					if(!model) return res.send({ code:500, err: "Document doesn't exist." });
					opt.collectionCount = model.toObject()[endpoint].length;
					if(cb)
						cb(req,res,opt)
					else
						res.send(opt);
				});
			}
			else
			{
				let q = Model.find({ _id: req.params.id },fields.join(' '));
				for(let i in POPULATE)
					q = q.populate(endpoint+"."+i,POPULATE[i]);
				q.exec(function(err,docs)
				{
					if(err) return res.send({ err: "Database Error" , code: 500 });
					console.log(docs);
					if(!docs[0]) return res.send({ err: "Document not found.", code: 500});

					docs = docs[0][endpoint];

					docs.sort(function(a,b){ 
						for(let i in sort)
						{
							if(a[i]!=b[i])
								return (1-2*(a[i]>b[i]))*sort[i];
						}
					});

					if(cb)
						cb(req,res,docs);
					else
						res.send(docs);
				});
			}
		});
	}
}


exports.get_endpoint = function(Model,endpoint,cb)
{
	let PERMISSIONS = Model.config.endpoints[endpoint];
	let POPULATE = PERMISSIONS.populate || {};

	return function(req,res,next)
	{
		get_permission_endpoint(Model,endpoint,req,res,1,function()
		{
			let target_id = req.params.field_id;
			let fields = lib.fields(req,PERMISSIONS);
			let sort = lib.sort(req,PERMISSIONS);

			let q = Model.find({ _id: req.params.id },fields.join(' '));
			for(let i in POPULATE)
				q = q.populate(endpoint+"."+i,POPULATE[i]);
			q.exec(function(err,docs)
			{
				if(err) return res.send({ err: "Database Error" , code: 500 });
				if(!docs[0]) return res.send({ err: "Document not found.", code: 500});
				docs = docs[0][endpoint];
				docs = docs.map(o=>o.toObject());
				let output;
				for(let i in docs)
				{
					if(docs[i]._id.equals(target_id))
					{
						output = docs[i];
						break;
					}
				}
				output = lib.hide_fields(output,PERMISSIONS);
				if(cb)
					cb(req,res,output);
				else
					res.send(output);
			});
		});
	}
}

exports.post_endpoint = function(Model,endpoint,custom,cb,pre)
{
	let PERMISSIONS = Model.config.endpoints[endpoint];
	return function(req,res,next)
	{
		get_permission_endpoint(Model,endpoint,req,res,2,function()
		{
			if(! lib.validate_fields(req,res,PERMISSIONS)) return;

			Model.findById(req.params.id,function(err,model)
			{
				if(err) return res.send({ code: 500, err: "Database Error."});
				if(!model) return res.send({ code: 500, err: "Model not found" });

				if(pre && !pre(req,res,model))
					return;
				if(!model) return;

				let temp_query = {};
				for(let i in PERMISSIONS)
					if(PERMISSIONS[i]&2)
						temp_query[i] = req.body[i];

				model[endpoint].push(temp_query);
				if(custom)
					model = custom(req,res,model);

				if(model)
				model.save(function(err,model)
				{
					if(err) return res.send({ code: 500, err: 'Database Error' });
					let output = lib.hide_fields(model[endpoint][model[endpoint.length-1]],PERMISSIONS);
					if(cb) cb(req,res,output); else res.send(output);
				});
			});		
		});
	}
}


exports.put_endpoint = function(Model,endpoint,custom,cb,pre)
{
	let PERMISSIONS = Model.config.endpoints[endpoint];
	return function(req,res,next)
	{
		get_permission_endpoint(Model,endpoint,req,res,4,function()
		{
			// if(! lib.validate_fields(req,res,PERMISSIONS)) return;

			let query = lib.sanitize(req,PERMISSIONS);

			Model.findById(req.params.id,function(err,model)
			{
				if(err) return res.send({ code: 500, err: "Database Error."});
				if(!model) return res.send({ code: 500, err: "Model not found" });


				if(pre && !pre(req,res,model))
					return;
				let modObj = model.toObject()[endpoint]
				for(let i in modObj)
				{
					if(modObj[i]._id.equals(req.params.field_id))
					{
						model[endpoint][i].set(query); 
						break;
					}
				}

				if(custom)
					model = custom(req,res,model);
				model.save(function(err,model)
				{
					if(err) return res.send({ code: 500, err: 'Database Error' });

					let modObj = model.toObject()[endpoint];
					let idx =  0;
					for(let i in modObj)
					{
						if(modObj[i]._id.equals(req.params.field_id))
						{
							idx = i;
							break;
						}
					}
					let output = lib.hide_fields(model[endpoint][idx],PERMISSIONS);
					if(cb) cb(req,res,output); else res.send(output);
				});
			});		
		});
	}
}

exports.delete_endpoint = function(Model,endpoint,custom,cb,pre)
{	
	let PERMISSIONS = Model.config.endpoints[endpoint];
	return function(req,res,next)
	{
		get_permission_endpoint(Model,endpoint,req,res,8,function()
		{
			Model.findById(req.params.id,function(err,model)
			{
				if(err) return res.send({ code: 500, err: "Database Error."});
				if(!model) return res.send({ code: 500, err: "Model not found" });

				if(pre && !pre(req,res,model))
					return;
				
				let modObj = model.toObject()[endpoint]
				for(let i in modObj)
				{
					if(modObj[i]._id.equals(req.params.field_id))
					{
						model[endpoint].splice(i,1);
						break; 
					}
				}

				if(custom)
					model = custom(req,res,model);
				if(model)
				model.save(function(err,model)
				{
					if(err) return res.send({ code: 500, err: 'Database Error' });
					if(cb) cb(req,res);
					else return res.send({ message: "Delete successful" })
				});
			});		
		});
	}
}


// LOGGED
exports.logged	 = function(req,res,next)
{
	if(!(req.session && req.session.passport && req.session.passport.user))
		return res.send({ err: 'Please login to continue', code: 403})
	next();
}
