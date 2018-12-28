app.controller("guildNewController",function($scope,$http,$location,$timeout,session)
{
	let model = 
	{
	   name: "",
	   description: "",
	 };

	let api = 
	{
		loading: false,
		error: '',
		submit: function()
		{
			if(!api.validate())
			{
				api.error = "Can't post an empty content.";
				return;
			}	
			api.error = '';
			api.loading = true;
			$http.post('/api/guild',model).then((res)=>
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
				$scope.parent_api.new.success(res);
		}
	}


	$scope.model   = model;
	$scope.api    = api;
});