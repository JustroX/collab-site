app.service('schemaService', function($http,$timeout,$rootScope) 
{
	let schemaService = this;
	this.definitions = null;
	this.models = [];

	this.init = function(cb2)
	{
		let a= { then: function(cb){a.done = cb;}};
		if(schemaService.definitions)
		{
			$timeout(function()
			{
				cb2 && cb2() && a.done && a.done();
			},1);
		}
		else
		$http.get('/model/models.json').then(function(res)
		{
			schemaService.definitions = res.data;
			$timeout(function()
			{
				cb2 && cb2() && a.done && a.done();
			},10);
		});
		return a;
	}

	this.getModels = function()
	{
		let m  = [];
		for(let i in this.definitions)
			m.push(i);
		return m;
	}

	this.getRequired = function(method,model)
	{	
		model = model.charAt(0).toUpperCase() + model.slice(1);
		let perm  = (1 << ["post","put"].indexOf(method));
		let arr = [];
		for(let i in this.definitions[model].required)
			if(this.definitions[model].required[i]&perm)
				arr.push(i);
		return arr;
	}
	this.getFields = function(model)
	{	
		model = model.charAt(0).toUpperCase() + model.slice(1);
		let arr = [];
		for(let i in this.definitions[model].permissions)
				arr.push(i);
		return arr;
	}
});


