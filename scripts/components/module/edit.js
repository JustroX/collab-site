app.controller("moduleEditController",function($scope,$http,$location,$timeout,session)
{
	let model = 
	{
		name: "", 
		guild: "",
	 };

	let api = 
	{
		loading: false,
		error: '',
		submit: function()
		{
			if(!api.validate())
			{
				api.error = "Can't update an empty content.";
				return;
			}	
			api.error = '';
			api.loading = true;
			$http.put('/api/module/'+api.view.target,$scope.model).then((res)=>
			{
				res = res.data;
				api.loaded(res);
				api.loading = false;
				if(res.err)
					return api.err(res.err);
				api.success(res)
			});
		},
		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		loaded: function(res)
		{

			model = 
			{
			   name: "",
			   description: "",
			};
			$scope.model = model;

		},
		validate: function()
		{
			return model.description!="" &&  model.name!="" ;
		},
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.edit.success(res);
		}
	};
	let view =
	{
		loading: false,
		error: '',
		target: '',
		param: '',
		load: function()
		{
			session.onready(function()
			{
				view.loading = true;
				$http.get('/api/module/'+view.target+'?'+view.param).then((res)=>
				{
					view.load_options();
					res = res.data;
					view.loading = false;
					if(res.err)
						return view.err(res.err);
					view.success(res);
				});
			});
		},
		load_options: function()
		{
			$http.get('/api/module?options=true').then((res)=>
			{
				res = res.data;
				view.options = res;
			});
		},
		err: function(mes)
		{
			view.error = mes;
			console.log("API ERROR: "+mes);
		},
		success: function(res)
		{
			$timeout(function()
			{
				model = res
				$scope.model = model;
			},1);
		},
	}

	api.view =  view;
	$scope.model = model;
	$scope.api = api;

});