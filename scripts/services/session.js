app.service('session', function($http,$timeout,modelService) 
{
	let model = modelService.new({ id: "session_user", model: "user", target: "self" });
	let no_model = true;

	this.load = function(cb)
	{
		cb = cb || function(){};
		model.load("self")
		.then(function(res)
		{
			no_model = false;
			cb(res);
		})
		.error(function(err){
			no_model = true;
			cb(err);
		});
	}
	this.end = function()
	{
		no_model = true;
	}
	this.getUser = function()
	{
		return no_model? false : model.value.model;
	}

});


