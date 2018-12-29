app.controller("badgeDeleteController",function($scope,$http,$location,$timeout,session)
{
	let api = 
	{
		target: ($scope.parent_api && $scope.parent_api.target) || "",
		loading: false,
		error: '',
		delete: function()
		{
			api.error = '';
			api.loading = true;

			//validate here

			if(!api.target) api.error="API: Target not specified";

			$http.delete('/api/badge/'+api.target).then((res)=>
			{
				res = res.data;
				api.loading = false;
				api.target = '';
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
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.delete.success(res);
		}
	}

	$scope.api = api;
});